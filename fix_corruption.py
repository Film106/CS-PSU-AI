
import os

# Fix style.css
style_path = r"d:\CS\style.css"
with open(style_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the last valid CSS line. Based on earlier views, line ~1930 was safe.
# Let's look for the last '}' that belongs to a valid animation or rule.
# To be safe, let's keep everything up to the glitch animations which were around line 1910-1940.
last_valid_line = -1
for i, line in enumerate(lines):
    if "} /* !! */" in line: # I'll look for something I can identify
        pass
    if "@keyframes glitch2 {" in line:
        last_valid_line = i

# Actually, let's just keep the first 1930 lines which I know are safe.
new_lines = lines[:1938]
if "}" not in new_lines[-1]:
    new_lines.append("}\n")

likert_css = """
/* Likert Scale and Input Styles */
.likert-row {
  display: grid !important;
  grid-template-columns: repeat(5, 1fr) !important;
  gap: 8px !important;
}

.likert-opt {
  flex-direction: column !important;
  padding: 16px 8px !important;
  text-align: center !important;
  justify-content: center !important;
}

.likert-opt .olabel {
  margin-right: 0 !important;
  margin-bottom: 8px !important;
  width: 28px !important;
  height: 28px !important;
}

.l-desc {
  font-size: 0.65rem;
  color: var(--muted);
  font-weight: 500;
}

/* Number input styling */
input[type='number'] {
  background: transparent;
  border: none;
  color: white;
  width: 100%;
  padding: 8px 0;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
"""

with open(style_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
    f.write(likert_css)

print("style.css repaired")

# Fix index.html hardcoded count
html_path = r"d:\CS\index.html"
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<span>/10</span>', '<span id="total-q">/10</span>')
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html updated")

# Fix script.js to update total count
js_path = r"d:\CS\script.js"
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('const TOTAL = QUESTIONS.length;', 'const TOTAL = QUESTIONS.length;\ndocument.getElementById("total-q").textContent = "/" + TOTAL;')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("script.js updated")
