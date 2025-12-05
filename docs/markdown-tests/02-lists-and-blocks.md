# 02 - Lists & Block Elements

## Basic Unordered Lists

- Item one
- Item two
- Item three

Using asterisks:

* Asterisk item one
* Asterisk item two
* Asterisk item three

Using plus:

+ Plus item one
+ Plus item two
+ Plus item three

---

## Basic Ordered Lists

1. First item
2. Second item
3. Third item

Starting from different number:

5. Fifth item
6. Sixth item
7. Seventh item

All using 1:

1. First
1. Second
1. Third

---

## Nested Unordered Lists

- Level 1 Item A
  - Level 2 Item A1
  - Level 2 Item A2
    - Level 3 Item A2a
    - Level 3 Item A2b
      - Level 4 deep nesting
        - Level 5 even deeper
  - Level 2 Item A3
- Level 1 Item B
  - Level 2 Item B1

---

## Nested Ordered Lists

1. First main item
   1. First sub-item
   2. Second sub-item
      1. First sub-sub-item
      2. Second sub-sub-item
   3. Third sub-item
2. Second main item
   1. Another sub-item

---

## Mixed List Nesting

1. Ordered first
   - Unordered inside ordered
   - Another unordered
     1. Ordered inside unordered inside ordered
     2. Second ordered
   - Back to unordered
2. Ordered second
   - Mixed content
     - Deep unordered
       1. Super nested ordered

---

## Task Lists (GFM)

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task
  - [x] Nested completed subtask
  - [ ] Nested incomplete subtask

---

## Multi-line List Items

- This is a list item that spans multiple lines.
  The continuation is indented properly and should
  flow naturally as part of the same item.

- Second item with a paragraph break.

  This is a second paragraph within the same list item.
  It should remain part of the bullet.

- Third item back to normal.

---

## Blockquotes

> This is a simple blockquote.

> This is a multi-line blockquote.
> It continues on multiple lines.
> And has more content here.

> This blockquote has
>
> Multiple paragraphs inside with blank lines.
>
> Third paragraph in the quote.

---

## Nested Blockquotes

> Level 1 quote
>> Level 2 nested quote
>>> Level 3 deeply nested quote
>>>> Level 4 very deep nesting

> Back to level 1
>> Level 2 again
> Back to level 1

---

## Blockquotes with Other Elements

> ### Heading inside blockquote
>
> This is a paragraph inside a blockquote with **bold** and *italic*.
>
> - List item 1 in quote
> - List item 2 in quote
>
> ```javascript
> // Code block inside blockquote
> const x = "nested code";
> ```
>
> Final paragraph of the complex blockquote.

---

## GitHub Alerts (if supported)

> [!NOTE]
> This is a note providing helpful information.

> [!TIP]
> This is a tip for better usage.

> [!IMPORTANT]
> This is important information you should know.

> [!WARNING]
> This is a warning about potential issues.

> [!CAUTION]
> This indicates dangerous actions that may cause problems.

---

## Horizontal Rules

Three dashes:

---

Three asterisks:

***

Three underscores:

___

With spaces:

- - -

* * *

---

## Definition Lists (if supported)

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Alternative definition for term 2

---

## Lists with Complex Content

1. **Bold list item title**

   Regular paragraph content under the bold title. This tests how list items handle complex nested content.

2. *Italic list item*

   > Blockquote inside a list item

3. List item with `inline code` and a [link](https://example.com)

   | Mini | Table |
   |------|-------|
   | in   | list  |
