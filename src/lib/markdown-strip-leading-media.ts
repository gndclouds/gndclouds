/**
 * Remove consecutive leading markdown images and Obsidian→HTML video blocks
 * (same shape as project `processMarkdown` / MarkdownContent `convertImageSyntax`)
 * so the first in-body asset is not duplicated under a hero/card image.
 */
export function stripLeadingMediaBeforeTextBlocks(markdown: string): string {
  let s = markdown.replace(/^\uFEFF/, "");
  for (;;) {
    const before = s;
    s = s.replace(/^[ \t\r\n]+/, "");
    if (s !== before) continue;

    const video = s.match(
      /^<div\s+style="margin:\s*1rem\s+0;">[\s\S]*?<\/div>[ \t\r\n]*/i
    );
    if (video) {
      s = s.slice(video[0].length);
      continue;
    }

    const mdImg = s.match(/^!\[[^\]]*\]\([^)]*\)[ \t\r\n]*/);
    if (mdImg) {
      s = s.slice(mdImg[0].length);
      continue;
    }

    break;
  }
  return s;
}
