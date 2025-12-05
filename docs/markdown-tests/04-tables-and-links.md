# 04 - Tables, Links & Media

## Basic Table

| Name    | Age | City       |
|---------|-----|------------|
| Alice   | 28  | New York   |
| Bob     | 34  | London     |
| Charlie | 22  | Tokyo      |

---

## Table with Alignment

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left text    | Center text    | Right text    |
| More left    | More center    | More right    |
| 12345        | 12345          | 12345         |

---

## Table with Formatting Inside

| Feature         | Status   | Description                          |
|-----------------|----------|--------------------------------------|
| **Bold item**   | ✅ Done  | This has `inline code` in it         |
| *Italic item*   | 🚧 WIP  | This has a [link](https://example.com) |
| ~~Deprecated~~  | ❌ No   | This is ~~struck through~~           |
| Normal item     | ⏳ Wait | Combination of **bold** and *italic* |

---

## Wide Table (Many Columns)

| Col 1 | Col 2 | Col 3 | Col 4 | Col 5 | Col 6 | Col 7 | Col 8 | Col 9 | Col 10 |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|--------|
| A1    | A2    | A3    | A4    | A5    | A6    | A7    | A8    | A9    | A10    |
| B1    | B2    | B3    | B4    | B5    | B6    | B7    | B8    | B9    | B10    |

---

## Table with Long Content

| Column Name | Long Description Content |
|-------------|--------------------------|
| Short       | This is a very long description that might wrap to multiple lines depending on the table width and how the renderer handles overflow content in table cells |
| Brief       | Another lengthy explanation that tests how table cells handle extended text without explicit line breaks or truncation |

---

## Empty Table Cells

| Present | Missing | Empty |
|---------|---------|-------|
| Value   |         | Value |
|         | Value   |       |
| Value   | Value   | Value |

---

## Minimal Table

| A | B |
|---|---|
| 1 | 2 |

---

## Basic Links

[Simple Link](https://example.com)

[Link with Title](https://example.com "This is the title")

Click here to visit [Google](https://google.com) or [GitHub](https://github.com).

---

## Reference-Style Links

[Reference Link][ref1]

[Another Reference][ref2]

[Implicit Reference][]

[ref1]: https://example.com "Reference 1"
[ref2]: https://example.org "Reference 2"
[Implicit Reference]: https://implicit.com

---

## Autolinks

Plain URL: https://www.example.com

Email: <contact@example.com>

URL with angle brackets: <https://www.google.com>

---

## Links with Special Characters

[Link with spaces in URL](https://example.com/path%20with%20spaces)

[Link with query params](https://example.com/search?q=hello&lang=en)

[Link with hash/fragment](https://example.com/page#section-name)

[Link with all features](https://example.com/path/to/page?query=value&other=123#anchor)

---

## Relative Links and Anchors

[Same-page anchor link](#basic-table)

[Relative file link](../README.md)

[Relative with anchor](../README.md#installation)

---

## Images

### Basic Image

![Alt text for image](https://via.placeholder.com/300x200)

### Image with Title

![Image with tooltip](https://via.placeholder.com/400x200 "This is the image title")

### Small Image

![Small icon](https://via.placeholder.com/50x50)

### Large Image

![Large banner](https://via.placeholder.com/800x200)

---

## Image as Link

[![Click this image](https://via.placeholder.com/200x100)](https://example.com)

---

## Reference-Style Images

![Reference Image][img1]

[img1]: https://via.placeholder.com/250x150 "Reference image title"

---

## Broken Image (for error handling test)

![This image should not load](https://invalid-url-that-does-not-exist.fake/image.png)

---

## Footnotes (GFM Extension)

This text has a footnote[^1] in it.

Here's another statement with a footnote[^2].

And one more with a named footnote[^note].

[^1]: This is the first footnote.
[^2]: This is the second footnote with more content.
[^note]: This is a named footnote.

---

## Links in Various Contexts

**Bolded [link inside bold](https://example.com) text**

*Italicized [link inside italic](https://example.com) text*

`code with a [link inside](https://example.com)` (should not render as link)

> Blockquote with a [link inside](https://example.com)

- List item with [a link](https://example.com)
- Another [link here](https://example.org)

---

## Escaping Link Syntax

\[This is not a link\](https://example.com)

This is text with [brackets] that are not links.

---

## Complex Table with Everything

| Feature | Links | Code | Emoji |
|:--------|:-----:|------|------:|
| Item 1 | [Link](https://example.com) | `code` | 🚀 |
| Item 2 | [Another](https://test.com) | `more code` | ✨ |
| **Bold** | [Bold Link](https://bold.com) | `bold code` | 💥 |
