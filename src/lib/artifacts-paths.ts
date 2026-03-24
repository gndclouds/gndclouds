/**
 * DB repo folder for portfolio items imported from the external `db` repo.
 * User-facing routes and copy still say "projects"; this is the on-disk / GitHub path.
 */
export const ARTIFACTS_DB_DIRECTORY = "3-artifacts";

/** Parent directory of an artifact markdown file in the repo (e.g. `3-artifacts/foo/bar.md` → `3-artifacts/foo`). */
export function artifactMarkdownDir(markdownFilePath: string): string {
  const parts = markdownFilePath.split("/");
  parts.pop();
  return parts.join("/");
}

/**
 * Resolve Obsidian-style `![[assets/...]]` paths for artifact markdown.
 * Relative to the folder that contains the `.md` file when possible.
 */
export function resolveArtifactWikiAssetRepoPath(
  cleanPath: string,
  markdownFilePath: string
): string {
  const trimmed = cleanPath.trim();
  const base = artifactMarkdownDir(markdownFilePath);
  if (trimmed.startsWith("assets/")) {
    return `${base}/${trimmed}`;
  }
  if (trimmed.includes("/")) {
    return `assets/${trimmed}`;
  }
  return `assets/${trimmed}`;
}
