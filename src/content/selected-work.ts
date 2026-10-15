export type GalleryFilter = 'all' | 'software' | 'film';
export type GalleryMode = 'browse' | 'viewer';

export interface ProjectLink { label: string; href: string }
export interface ProjectContributor {
  id: string;
  name: string;
  role: string;
  image?: string;
  imageKind?: 'logo';
  context?: string;
  links?: readonly ProjectLink[];
}
export interface ProjectNotes {
  heading: string;
  subtitle: string;
  brief: string;
  story?: readonly string[];
  music?: string;
  technology?: readonly string[];
  links?: readonly ProjectLink[];
  contributors?: readonly ProjectContributor[];
  pending?: string;
}
export interface NativeFilm { type: 'film'; poster: string; previewSrc: string; fullSrc?: `/${string}` }
export interface YouTubeFilm { type: 'youtube'; poster: string; previewSrc: string; youtubeId: string; orientation: 'portrait' | 'landscape' }
interface ProjectBase {
  id: string;
  title: string;
  label: string;
  description: string;
  color: string;
  notes?: ProjectNotes;
}
export type GalleryProject = ProjectBase & (
  | { kind: 'software'; presentation: { type: 'study-game' } | { type: 'provisional-cover'; note: string } | { type: 'static-image'; src: string; alt: string }; detailsHref?: string; websiteHref?: string }
  | { kind: 'film'; presentation: NativeFilm | YouTubeFilm; detailsHref?: never; websiteHref?: never }
);

export const selectedWork: readonly GalleryProject[] = [
  {
    id: 'adaptive-study-game', title: 'Adaptive Study Game', kind: 'software',
    label: 'Interactive learning', description: 'Choose a topic. Play a round. Find out what sticks.',
    color: '#001514', presentation: { type: 'study-game' },
    detailsHref: 'https://github.com/JStaRFilms/Adaptive-Study-Game',
    notes: {
      heading: 'A study tool I needed myself.', subtitle: 'Built while I was struggling to study for my final-year paper.',
      brief: 'Turn my source material into questions I could play through, explain what I got wrong, and let me practise the questions I missed.',
      story: [
        'I built Adaptive Study Game because reading for my final-year paper was becoming a struggle. I wanted to work through the material as a game, with questions that helped me find out what I actually understood.',
        'An early version became something I played with friends. We sat in a circle, brought our source materials and challenged each other on the questions. But I found it most useful on my own: answer a question, ask why I missed it, review my mistakes and try those questions again.',
        'The sample here is a fixed quiz, separate from the full application. The full app is currently unavailable.',
      ],
      technology: ['React', 'TypeScript'],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Lead Architect & Full-Stack Developer', image: '/team/john-oluleke-oke.jpg' },
        { id: 'JS004', name: 'Justina Ominisan', role: 'Studio support', context: 'Studio team: front-end design.', image: '/team/justina-ominisan.jpg' },
        { id: 'JS005', name: 'Ifechukwu Odigwe', role: 'Studio support', context: 'Studio team: AI tools engineering.', image: '/redesign/team-cutouts/ifechukwude-odigwe-v1.webp' },
      ],
      pending: 'Current screenshots are still to come. This viewer uses the existing product image.',
    },
  },
  {
    id: 'school-management-system', title: 'Melo', kind: 'software',
    label: 'Business software', description: 'School operations, results and billing.',
    color: '#1e3028', presentation: { type: 'provisional-cover', note: 'School operations, results and billing.' },
    websiteHref: 'https://www.meloschool.com/',
    notes: {
      heading: "Built for my mother's school.", subtitle: 'What began with results grew into a shared platform for the school community.',
      brief: 'Make preparing results easier, then bring school administration, payments and teaching support into one affordable platform.',
      story: [
        "Melo started because my mother's school needed software, and the existing options were too expensive. I had been building school workflows in Excel, so I began with a problem I already knew: making results easier to prepare.",
        "As I built it, I spoke with schools about the problems they faced. The goal grew into a shared platform for administrators, teachers, parents and students, with access to results, payments and the school's financial picture. I also wanted teachers to have AI-assisted tools for preparing lesson notes and previews.",
      ],
      technology: ['Next.js', 'React', 'TypeScript', 'Convex'],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Lead Architect & Full-Stack Developer', image: '/team/john-oluleke-oke.jpg' },
        { id: 'JS004', name: 'Justina Ominisan', role: 'Studio support', context: 'Studio team: front-end design.', image: '/team/justina-ominisan.jpg' },
        { id: 'JS005', name: 'Ifechukwu Odigwe', role: 'Studio support', context: 'Studio team: AI tools engineering.', image: '/redesign/team-cutouts/ifechukwude-odigwe-v1.webp' },
      ],
      pending: 'Product screenshots are still to come. Visit website opens the public marketing site, not a verified demo. Studio support is separate from implementation credit.',
    },
  },
  {
    id: 'nifemi', title: 'Nifemi', kind: 'film', label: 'Film',
    description: 'A personal experiment in storyboarding, effects and a new editing style.', color: '#092d3c',
    presentation: { type: 'film', poster: '/redesign/gallery-nifemi.jpg', previewSrc: '/redesign/gallery-nifemi-10s.mp4', fullSrc: '/redesign/nifemi.mp4' },
    notes: {
      heading: 'My first hyper-edit.', subtitle: 'A personal experiment in storyboarding, effects and a new editing style.',
      brief: 'Plan a cinematic model video, then push the edit with After Effects and a bold blue colour treatment.',
      story: ['A new Lil Nas X track gave me an excuse to try an editing style I had never attempted before. I called a friend who models, storyboarded the ideas and planned the piece before the shoot.', 'Nifemi became my first hyper-edited video, with After Effects work and a deliberately blue colour treatment. It pushed me beyond my usual editing style.'],
      music: 'J Christ by Lil Nas X',
      links: [
        { label: 'Instagram', href: 'https://www.instagram.com/reel/C2mR-QqMvNR/' },
        { label: 'TikTok', href: 'https://www.tiktok.com/@j_star.effects/video/7328572198497651974' },
        { label: 'YouTube', href: 'https://www.youtube.com/watch?v=oUBga-TNjgA' },
      ],
      contributors: [
        { id: 'john', name: 'Oluleke Oke John', role: 'Planning, storyboarding, editing, visual effects and colour', image: '/team/john-oluleke-oke.jpg' },
        { id: 'nifemi', name: 'Nifemi', role: 'Model', links: [{ label: 'TikTok', href: 'https://www.tiktok.com/@yn_ninii' }] },
      ],
    },
  },
  {
    id: 'sharon', title: 'Sharon', kind: 'film', label: 'Film',
    description: 'A hyper-edited birthday video for Sharon.', color: '#343c20',
    presentation: { type: 'film', poster: '/redesign/gallery-sharon.jpg', previewSrc: '/redesign/gallery-sharon-10s.mp4', fullSrc: '/redesign/sharon-mobile-candidate.mp4' },
    notes: {
      heading: 'Same place. Different mood.', subtitle: 'A hyper-edited birthday video for Sharon.',
      brief: 'Make a hyper-edited birthday video for Sharon, returning to a familiar location with a different mood and cutting to the music.',
      story: ["I hadn't made a hyper-edited video since January. When Sharon's birthday came around in December, it felt like the right reason to return to it. She was my manager at the time and is now the COO of the company.", 'We revisited the location I had used for Nifemi, but I wanted this piece to feel different. This time I had a song in mind rather than a detailed storyboard. The birthday and the music gave the video its direction.'],
      music: 'TTSO. by Armani White',
      links: [{ label: 'TikTok', href: 'https://www.tiktok.com/@j_star.effects/video/7445780697303862533' }],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Production, filming, scripting, editing, VFX and colour', image: '/team/john-oluleke-oke.jpg' },
        { id: 'JS003', name: 'Sharon Alalibo', role: 'Featured subject / muse', image: '/team/sharon-alalibo.jpg', context: 'Chief Operating Officer & Head of Human Resources at J StaR Films Studios.' },
      ],
    },
  },
  {
    id: 'books-and-bills', title: 'The Burden of Books and Bills', kind: 'film', label: 'Mini-documentary',
    description: 'Editing, sound and colour for a student-led coursework documentary.', color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'p1yqihuevu0', orientation: 'landscape', poster: '/redesign/gallery-books-and-bills-poster.jpg', previewSrc: '/redesign/gallery-books-and-bills-10s.mp4' },
    notes: {
      heading: 'Bringing a student documentary together.',
      subtitle: 'Editing, sound and colour for a student-led coursework documentary.',
      brief: "Bring the students' footage, script and voice-over into a finished documentary, using campus B-roll, sound design and colour to tie it together.",
      story: [
        'Final-year mass communication students approached us for help with their documentary coursework. They had filmed much of the material and handled the scripting and voice-over, with Monjolaoluwa Aminu helping lead the project.',
        'We brought in campus B-roll we had already shot for another project and put the film together in the edit. Sound design and colour grading helped bring their material into one finished piece.',
      ],
      links: [
        { label: 'YouTube', href: 'https://www.youtube.com/watch?v=p1yqihuevu0' },
        { label: 'Related campus film', href: 'https://www.youtube.com/watch?v=hApE9DNUFN8' },
      ],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Editing, sound design, colour grading, additional campus B-roll and production support', image: '/team/john-oluleke-oke.jpg' },
        { id: 'JS002', name: 'Monjolaoluwa Aminu', role: 'Project lead', image: '/team/monjola-aminu.jpg', context: 'Chief Brand & Communications Officer at J StaR Films Studios. Mass communication graduate.', links: [{ label: 'YouTube', href: 'https://www.youtube.com/@monjolaoluwaaminu' }] },
        { id: 'mass-communication-students', name: 'Final-year mass communication students', role: 'Filming, scripting and voice-over' },
      ],
      pending: 'Exact cohort year and published-export matching remain unconfirmed. The related campus film is a link, not an additional gallery selection.',
    },
  },
  {
    id: 'forest-sequence', title: '3D Forest Sequence', kind: 'film', label: 'Unreal Engine 5',
    description: 'A scene-building experiment using Quixel Bridge assets.', color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'W9tVsQjrORc', orientation: 'portrait', poster: '/redesign/gallery-forest-sequence-poster.jpg', previewSrc: '/redesign/gallery-forest-sequence-10s.mp4' },
    notes: {
      heading: 'Learning Unreal Engine through a forest scene.',
      subtitle: 'A scene-building experiment using Quixel Bridge assets.',
      brief: 'Build a forest sequence to learn Unreal Engine, using ready-made assets to focus on scene setup, lighting and camera movement.',
      story: ['I made this forest sequence as an experiment while learning Unreal Engine. Ready-made assets from Quixel Bridge gave me a starting point, so I could focus on building the scene, setting its lighting and creating the camera sequence.'],
      technology: ['Unreal Engine 5', 'Quixel Bridge'],
      links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=W9tVsQjrORc' }],
      contributors: [{ id: 'john', name: 'John Oluleke-Oke', role: 'Scene setup, lighting and camera sequencing', image: '/team/john-oluleke-oke.jpg', context: '@johnoluleke-oke' }],
      pending: 'Specific asset packs, licence details and published-export matching remain unconfirmed. No original asset modelling is claimed.',
    },
  },
  {
    id: 'worship-medley', title: 'Worship Medley - Success Light', kind: 'film', label: 'Live performance',
    description: "Editing and colour grading for Success Light's Worship Medley.", color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'xzXaKeQi8YQ', orientation: 'landscape', poster: '/redesign/gallery-worship-medley-poster.jpg', previewSrc: '/redesign/gallery-worship-medley-10s.mp4' },
    notes: {
      heading: 'Matching a multi-camera performance.',
      subtitle: "Editing and colour grading for Success Light's Worship Medley.",
      brief: 'Bring footage from different cameras into a consistent performance edit, with the colour look the client wanted.',
      story: [
        "I received footage from several cameras for Success Light's worship medley. The production team had already shot the performance and handled the sound design; my role was editing and colour grading.",
        "Most of the work was in the colour. I did not know all the footage's colour spaces, so I worked to match the shots as consistently as possible while giving the client the look they wanted.",
      ],
      links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=xzXaKeQi8YQ' }],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Editing and colour grading', image: '/team/john-oluleke-oke.jpg' },
        { id: 'success-light', name: 'Success Light', role: 'Artist', links: [
          { label: 'YouTube', href: 'https://www.youtube.com/@successlight6408' },
          { label: 'Instagram', href: 'https://www.instagram.com/success_light_official/' },
        ] },
      ],
      pending: 'Individual production crew, specific camera/colour-space details and published-export matching remain unconfirmed. Spotify and Linktree destinations are not verified.',
    },
  },
  {
    id: 'samsung-vivid-colors', title: 'Samsung Galaxy: See Your World in Vivid Colors', kind: 'film', label: 'Short video',
    description: 'A personal showcase for Samsung HDR10+.', color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'mQU9SJwNGo0', orientation: 'landscape', poster: '/redesign/gallery-samsung-vivid-colors-poster.jpg', previewSrc: '/redesign/gallery-samsung-vivid-colors-10s.mp4' },
    notes: {
      heading: 'A personal showcase for Samsung HDR10+.',
      subtitle: 'Filming, editing, sound and colour for a short cinematic experiment.',
      brief: 'Show Samsung HDR10+ through a cinematic, colour-led short with on-screen text.',
      story: [
        'I wanted to give Samsung HDR10+ more attention after hearing the discussion around Apple Log. This was a personal showcase. I hoped Samsung might notice it, but it was not commissioned by the brand.',
        'I shot and edited the film myself, and handled the colour grading and sound design. I kept it simple, using cinematic footage and on-screen text to draw attention to the colours. Afterwards, I published a separate video explaining the technology and colour-grading workflow.',
      ],
      links: [
        { label: 'YouTube', href: 'https://www.youtube.com/watch?v=mQU9SJwNGo0' },
        { label: 'HDR10+ explainer', href: 'https://www.youtube.com/watch?v=J7E0qyrX2w0' },
      ],
      contributors: [{ id: 'john', name: 'John Oluleke-Oke', role: 'Filming, editing, colour grading and sound design', image: '/team/john-oluleke-oke.jpg' }],
      pending: 'Published-export matching and HDR delivery of the upload are not verified. The explainer is related work, not another gallery entry.',
    },
  },
  {
    id: 'brushes-of-gold', title: 'Brushes of GOLD', kind: 'film', label: 'Cinematic vlog',
    description: 'A Sunday vlog at Elizade University, shot in HDR10+ and graded in DaVinci Resolve.', color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'Up46AtcYwTY', orientation: 'landscape', poster: '/redesign/gallery-brushes-of-gold-poster.jpg', previewSrc: '/redesign/gallery-brushes-of-gold-10s.mp4' },
    notes: {
      heading: 'Could an ordinary Sunday look cinematic?',
      subtitle: 'A Sunday vlog at Elizade University, shot in HDR10+ and graded in DaVinci Resolve.',
      brief: 'Film a full day and use colour grading to see how cinematic everyday moments could look.',
      story: [
        'I wanted to find out whether I could make an ordinary day look cinematic. I was learning colour grading in DaVinci Resolve, so I decided to film a full Sunday in HDR10+ and grade it afterwards.',
        'At Elizade University, where I was studying, I filmed the campus, went to church and caught up with friends. People smiled, laughed and sometimes ran from the camera. I gave the footage a teal-and-orange look, and the day became a fun way to put what I was learning into practice.',
      ],
      technology: ['DaVinci Resolve'],
      links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=Up46AtcYwTY' }],
      contributors: [{ id: 'john', name: 'John Oluleke-Oke', role: 'Filming, editing, colour grading and sound design', image: '/team/john-oluleke-oke.jpg' }],
      pending: 'Soundtrack clearance, exact date, published-export matching and HDR delivery of the upload remain unverified. Friends appearing in the vlog are not credited as production crew.',
    },
  },
  {
    id: 'welcome-to-church', title: 'Welcome to Church', kind: 'film', label: 'Church invitation',
    description: 'A church invitation at Elizade University Chapel, with text animation in After Effects.', color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'c9qb9ZVG48I', orientation: 'landscape', poster: '/redesign/gallery-welcome-to-church-poster.jpg', previewSrc: '/redesign/gallery-welcome-to-church-10s.mp4' },
    notes: {
      heading: 'Animated type for a campus invitation.',
      subtitle: 'A church invitation at Elizade University Chapel, with text animation in After Effects.',
      brief: "Invite students to the next day's church service, using After Effects' 3D tools to animate the on-screen text.",
      story: [
        'At Elizade University Chapel, we used to make short videos inviting students to church the next day. I made this one with Elizabeth, who presented the invitation.',
        'I directed and filmed it, then handled the edit, sound design, colour grading and VFX. I had not worked with After Effects in a while, so I tried using its 3D tools to make text slide into the scene. It was a fun experiment that added another layer to the invitation.',
      ],
      technology: ['After Effects'],
      links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=c9qb9ZVG48I' }],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Direction, filming, editing, sound design, colour grading and VFX', image: '/team/john-oluleke-oke.jpg' },
        { id: 'elizabeth', name: 'Elizabeth', role: 'Presenter', context: 'The Life of a God Fearing Teenager', links: [
          { label: 'Instagram', href: 'https://www.instagram.com/thelifeofagodfearingteenager/' },
          { label: 'YouTube', href: 'https://www.youtube.com/@TheLifeofaGodFearingTeenager' },
        ] },
      ],
      pending: 'Elizabeth surname, coordinator title and published-export matching are not confirmed. The earlier Teenagers Pray candidate is not linked.',
    },
  },
  {
    id: 'fear-women', title: 'Fear Women', kind: 'film', label: 'Short film',
    description: 'A student comedy short about tangled relationships and conflicting pregnancy claims.', color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'VYIWXJlIzMs', orientation: 'landscape', poster: '/redesign/gallery-fear-women-poster.jpg', previewSrc: '/redesign/gallery-fear-women-10s.mp4' },
    notes: {
      heading: 'One of my early short films.',
      subtitle: 'A student comedy short about tangled relationships and conflicting pregnancy claims.',
      brief: "Bring a student comedy short through production and post-production, working from the team's script.",
      story: [
        'Fear Women was a mass communication group project coordinated by Monjolaoluwa Aminu, who also directed and acted in it. The story follows a married man caught in tangled relationships and conflicting pregnancy claims.',
        'It was one of the first short films I worked on. I handled production, co-directed and filmed it, then worked on the edit, colour grading, sound design and sound production. I also made a brief cameo near the end. I did not write the script, but taking the film through production and post was a valuable early experience.',
      ],
      links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=VYIWXJlIzMs' }],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Production, co-direction, filming, editing, colour grading, sound design, sound production and cameo appearance', image: '/team/john-oluleke-oke.jpg' },
        { id: 'JS002', name: 'Monjolaoluwa Aminu', role: 'Director, acting and project coordination', image: '/team/monjola-aminu.jpg', context: 'Chief Brand & Communications Officer at J StaR Films Studios.', links: [{ label: 'YouTube', href: 'https://www.youtube.com/@monjolaoluwaaminu' }] },
      ],
      pending: 'Writer identity, other cast and character names, exact date and published-export matching remain unspecified. No script credit is inferred.',
    },
  },
  {
    id: 'everything', title: 'Everything - Tye Tribbett', kind: 'film', label: 'Live performance',
    description: 'Filming, editing and colour grading for Winning Worship Way Christian Centre.', color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'oAmKb6Zy6_4', orientation: 'landscape', poster: '/redesign/gallery-everything-poster.jpg', previewSrc: '/redesign/gallery-everything-10s.mp4' },
    notes: {
      heading: 'A multi-camera church performance.',
      subtitle: 'Filming, editing and colour grading for Winning Worship Way Christian Centre.',
      brief: 'Capture the church performance across multiple cameras and bring the footage together in the video edit and colour grade.',
      story: ['I filmed this performance for Winning Worship Way Christian Centre, then handled the multi-camera edit and colour grading. My work was on the video; I was not involved in the music or the audio mix.'],
      links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=oAmKb6Zy6_4' }],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Multi-camera filming, editing and colour grading', image: '/team/john-oluleke-oke.jpg' },
        { id: 'winning-worship-way', name: 'Winning Worship Way Christian Centre', role: 'Choir and band', image: '/redesign/contributors/winning-worship-way-logo.webp', imageKind: 'logo', links: [{ label: 'YouTube', href: 'https://www.youtube.com/@WinningWorshipWay' }] },
      ],
      pending: 'Individual performers, audio crew and published-export matching remain unconfirmed. Tye Tribbett is the song/title reference, not a performer credit for this event.',
    },
  },
  {
    id: 'meet-monjolaoluwa', title: 'Meet Monjolaoluwa!', kind: 'film', label: 'Introduction',
    description: 'A planned introduction built around Monjola and her story.', color: '#102a23',
    presentation: { type: 'youtube', youtubeId: 'ZdaMD-g-EzQ', orientation: 'landscape', poster: '/redesign/gallery-meet-monjolaoluwa-poster.jpg', previewSrc: '/redesign/gallery-meet-monjolaoluwa-10s.mp4' },
    notes: {
      heading: 'A grand entrance for her channel.',
      subtitle: 'A planned introduction built around Monjola and her story.',
      brief: 'Plan and film a story-led channel introduction across several scenes, with Monjola as the main character.',
      story: [
        'Monjolaoluwa Aminu wanted an introduction to her YouTube channel that felt like a grand entrance. We planned and scripted a storyline together, then shot it across several settings with her as the main character.',
        'I worked with her on the filming, choreography and production coordination, then handled the edit and sound design. The room scene was hers, filmed separately. The rest was a collaboration built around introducing her and her channel.',
      ],
      links: [{ label: 'YouTube', href: 'https://www.youtube.com/watch?v=ZdaMD-g-EzQ' }],
      contributors: [
        { id: 'john', name: 'John Oluleke-Oke', role: 'Co-planning, co-scripting, filming, choreography, production coordination, editing and sound design', image: '/team/john-oluleke-oke.jpg' },
        { id: 'JS002', name: 'Monjolaoluwa Aminu', role: 'Host, presenter, co-planning, co-scripting and self-filmed room scene', image: '/team/monjola-aminu.jpg', context: 'Chief Brand & Communications Officer at J StaR Films Studios.', links: [{ label: 'YouTube', href: 'https://www.youtube.com/@monjolaoluwaaminu' }] },
      ],
      pending: 'Exact scene count, other social destinations and published-export matching remain unconfirmed. No colour-grading or sole-production credit is inferred.',
    },
  },
];
