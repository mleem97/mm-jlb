from pathlib import Path

path = Path("components/SplitText.tsx")
text = path.read_text(encoding="utf-8")
text = text.replace(
    "const marginMatch = /^(-?\\d+(?:\\.\\d+)?)(px|em|rem|%)?$/.exec(rootMargin);",
    '''const parsedMarginValue = Number.parseFloat(rootMargin);
      const parsedMarginUnit = rootMargin.slice(String(parsedMarginValue).length);
      const marginMatch =
        Number.isFinite(parsedMarginValue) && ["", "px", "em", "rem", "%"].includes(parsedMarginUnit);''',
)
text = text.replace(
    "const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;\n      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';",
    "const marginValue = marginMatch ? parsedMarginValue : 0;\n      const marginUnit = marginMatch ? parsedMarginUnit || 'px' : 'px';",
)
text = text.replace(
    '''      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });''',
    '''      void document.fonts.ready
        .then(() => {
          setFontsLoaded(true);
        })
        .catch((error: unknown) => {
          console.error("Failed to wait for document fonts", error);
        });''',
)
path.write_text(text, encoding="utf-8")
