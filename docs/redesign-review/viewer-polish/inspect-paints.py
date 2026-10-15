"""Inspect captured browser paints, not the source films. Produce review evidence."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).parent
labels = ['sample-entry', 'sample-return', 'screenshot-entry', 'screenshot-return', 'native-entry', 'native-return']
report = {'method': 'All CDP PNG paints, RGB > 245 white fraction. Software has legitimate pale app content.', 'transitions': []}
concat = ['ffconcat version 1.0']
for label in labels:
    evidence = json.loads((root / f'{label}-geometry.json').read_text())
    paints = evidence['paints']
    fractions = []
    for i, paint in enumerate(paints):
        file = root / f'{label}-frames' / paint['file']
        with Image.open(file) as image:
            small = image.convert('RGB').resize((160, 100))
            white = sum(min(pixel) > 245 for pixel in small.getdata()) / 16000
            fractions.append(white)
        duration = max(.016, paints[i + 1]['timestamp'] - paint['timestamp']) if i + 1 < len(paints) else .25
        concat += [f"file '{file.resolve().as_posix()}'", f'duration {duration:.6f}']
    maximum = max(fractions)
    assert maximum < .98, f'{label} contains an almost entirely white browser paint: {maximum}'
    if label.startswith('native'):
        assert maximum < .2, f'{label} lost its dark movie/viewer surface: {maximum}'
    report['transitions'].append({'label': label, 'paintCount': len(paints), 'maxWhiteFraction': maximum, 'almostEntirelyWhitePaints': 0, 'rafSamples': len(evidence['frames'])})
    chosen = sorted(set([0, len(paints)//6, len(paints)//3, len(paints)//2, 2*len(paints)//3, len(paints)-1]))
    sheet = Image.new('RGB', (960, 3*220), '#12271f')
    draw = ImageDraw.Draw(sheet)
    for index, pick in enumerate(chosen):
        with Image.open(root / f'{label}-frames' / paints[pick]['file']) as image:
            image.thumbnail((480, 196))
            x, y = (index % 2)*480, (index // 2)*220
            sheet.paste(image, (x, y))
            draw.text((x+8, y+199), f'{label} paint {pick} / {len(paints)-1}', fill='white')
    sheet.save(root / f'{label}-contact.jpg')
(root / 'paint-results.json').write_text(json.dumps(report, indent=2))
(root / 'transitions.ffconcat').write_text('\n'.join(concat) + '\n')
print(json.dumps(report, indent=2))
