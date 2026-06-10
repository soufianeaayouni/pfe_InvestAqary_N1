Diagrams export instructions

Files:
- usecase.mmd
- class.mmd

Quick export (no install, using npx):

```powershell
npx -p @mermaid-js/mermaid-cli mmdc -i design/diagrams/usecase.mmd -o design/diagrams/usecase.png
npx -p @mermaid-js/mermaid-cli mmdc -i design/diagrams/class.mmd -o design/diagrams/class.png
```

Combine into one image (vertical append) using ImageMagick:

```powershell
magick convert -append design/diagrams/usecase.png design/diagrams/class.png design/diagrams/combined.png
```

If you prefer a single-step export, install `@mermaid-js/mermaid-cli` globally:

```powershell
npm install -g @mermaid-js/mermaid-cli
mmdc -i design/diagrams/usecase.mmd -o design/diagrams/usecase.png
mmdc -i design/diagrams/class.mmd -o design/diagrams/class.png
magick convert -append design/diagrams/usecase.png design/diagrams/class.png design/diagrams/combined.png
```

Notes:
- On Windows, ImageMagick `magick` command comes with the install; ensure it's on PATH.
- If you want, I can try to render them here, but that requires installing `@mermaid-js/mermaid-cli` and/or ImageMagick on this machine (ask me to proceed).