# 05 - Math, Advanced GFM & Edge Cases

## Inline Math (KaTeX)

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

Einstein's famous equation: $E = mc^2$

Simple expressions: $a^2 + b^2 = c^2$ and $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

Greek letters: $\alpha, \beta, \gamma, \delta, \epsilon, \theta, \lambda, \pi, \sigma, \omega$

---

## Block Math (KaTeX)

The Gaussian integral:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

Maxwell's equations:

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}
$$

$$
\nabla \cdot \mathbf{B} = 0
$$

Matrix notation:

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

---

## Complex Math Expressions

$$
\mathcal{L}\{f(t)\} = \int_0^{\infty} e^{-st} f(t) \, dt
$$

$$
\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u
$$

$$
\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e
$$

---

## Math in Lists and Tables

- The Euler identity: $e^{i\pi} + 1 = 0$
- The golden ratio: $\phi = \frac{1 + \sqrt{5}}{2}$
- Probability: $P(A|B) = \frac{P(B|A)P(A)}{P(B)}$

| Formula | Expression | Value |
|---------|------------|-------|
| Circle Area | $A = \pi r^2$ | ~3.14r² |
| Euler's Number | $e = \lim_{n \to \infty}(1+\frac{1}{n})^n$ | ~2.718 |
| Pi | $\pi = \frac{C}{d}$ | ~3.14159 |

---

## Raw HTML Elements

### Div with Custom Styling

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
  <h3 style="margin-top: 0;">Custom HTML Box</h3>
  <p>This is raw HTML with inline styles.</p>
  <p><strong>Bold</strong> and <em>italic</em> work here too.</p>
</div>

### Details/Summary (Collapsible)

<details>
<summary>Click to expand this section</summary>

This content is hidden by default. It can contain:

- Lists
- **Bold text**
- `Code snippets`
- And more markdown!

```javascript
const hidden = "This code is inside a collapsible section";
```

</details>

<details open>
<summary>This one starts open</summary>

This content is visible by default because of the `open` attribute.

</details>

---

### Centered Content

<div align="center">

### Centered Title

This paragraph is centered using align="center".

![Centered Image](https://via.placeholder.com/200x100)

</div>

---

### Color Badges / Pills

<span style="background-color: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">SUCCESS</span>
<span style="background-color: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">ERROR</span>
<span style="background-color: #ffc107; color: black; padding: 4px 8px; border-radius: 4px; font-weight: bold;">WARNING</span>
<span style="background-color: #17a2b8; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">INFO</span>

---

### Video Embed (iframe)

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>

---

## Edge Cases & Stress Tests

### Extremely Deep Nesting

> > > > > Level 5 nesting in blockquote
> > > > Back to level 4
> > > Level 3
> > Level 2
> Level 1

- Level 1
  - Level 2
    - Level 3
      - Level 4
        - Level 5
          - Level 6
            - Level 7
              - Level 8

---

### Mixed Nesting Chaos

1. Ordered item
   - Unordered inside
     1. Ordered again
        > Blockquote inside list
        > 
        > With multiple lines
        - Unordered in quote in list
          ```
          code in unordered in quote in list
          ```

---

### Emphasis Edge Cases

*Single asterisk start but no end
**Double asterisk start but no end
_Single underscore start but no end
`Unclosed backtick

Correct: *italic* **bold** `code`

Adjacent: *italic***bold**`code`

Within words: un*frigging*believable and un**frigging**believable

Underscores in identifiers: snake_case_variable_name (should not italicize)

---

### Very Long Unbroken Text

Thisisaverylongwordwithoutanyspacesorbreakstotesthowtherendererhandlesoverflowandwhetherithorizontallyscrollsorwrapsorcutsoffentirelywhichwouldbeproblematic

---

### Special Character Stress Test

<>&"'`~!@#$%^&*()_+-=[]{}|;:,.<>?/\

HTML entities: &amp; &lt; &gt; &quot; &apos; &nbsp; &copy; &reg;

Zero-width spaces: ​ (zero-width space is here)

Non-breaking space:    (multiple nbsp)

---

### Unicode Stress Test

العربية  
中文  
日本語  
한국어  
ไทย  
עברית  
Ελληνικά  
Русский  
🇺🇸🇬🇧🇫🇷🇩🇪🇯🇵  

---

### Table Inside Blockquote

> | Col A | Col B |
> |-------|-------|
> | 1     | 2     |
> | 3     | 4     |

---

### Code Inside Table

| Language | Code |
|----------|------|
| JS | `const x = 1;` |
| Python | `x = 1` |
| Rust | `let x = 1;` |

---

### List Immediately After Paragraph

No blank line before this list:
- Item 1
- Item 2
- Item 3

---

### Multiple Blank Lines

Text before



Multiple blank lines above



And more here.

---

### Trailing Whitespace

This line has trailing spaces:   
This line has a trailing tab:	
This line is normal.

---

### Empty Sections

###

#### 

#####

---

### Malformed Markdown

[Link without closing paren](https://example.com

![Image without closing paren](https://example.com/image.png

| Table | Without | Closing |
| ----- | ------- | -----

```
Code block without closing fence

---

### Very Long List

1. Item 1
2. Item 2
3. Item 3
4. Item 4
5. Item 5
6. Item 6
7. Item 7
8. Item 8
9. Item 9
10. Item 10
11. Item 11
12. Item 12
13. Item 13
14. Item 14
15. Item 15
16. Item 16
17. Item 17
18. Item 18
19. Item 19
20. Item 20
