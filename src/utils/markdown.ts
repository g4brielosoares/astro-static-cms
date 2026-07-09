const markerLinePatterns = [
  /^#{1,6}\s+/,
  /^>/,
  /^[-*_]{3,}$/,
  /^!\[/,
  /^[-*+]\s+/,
  /^\d+\.\s+/,
];

export function markdownTextToPlainText(text: string) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~#]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getFirstParagraphFromMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const paragraph: string[] = [];
  let isCodeFence = false;

  for (const rawLine of lines) {
    const trimmedLine = rawLine.trim();

    if (/^```|^~~~/.test(trimmedLine)) {
      isCodeFence = !isCodeFence;
      continue;
    }

    if (isCodeFence) continue;

    if (!trimmedLine) {
      if (paragraph.length) {
        return markdownTextToPlainText(paragraph.join(" "));
      }

      continue;
    }

    if (markerLinePatterns.some((pattern) => pattern.test(trimmedLine))) {
      continue;
    }

    paragraph.push(trimmedLine);
  }

  return paragraph.length
    ? markdownTextToPlainText(paragraph.join(" "))
    : undefined;
}
