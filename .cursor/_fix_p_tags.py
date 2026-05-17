# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"d:\Developer\projects\sechskies\totoga2\readable copy.html")
s = p.read_text(encoding="utf-8")
s = s.replace(
    '< class="intro-text"> class="ebook-intro-note">',
    '<p class="ebook-intro-note">',
)
s = s.replace('< class="intro-text">>', '<p class="intro-text">')
if '< class="intro-text">' in s:
    raise SystemExit("still broken intro-text tags")
p.write_text(s, encoding="utf-8", newline="\n")
print("fixed", s.count('class="intro-text"'))
