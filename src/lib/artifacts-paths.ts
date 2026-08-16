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
 * A leading `assets/` refers to the shared vault folder at repo root (`db/assets/` on disk),
 * not a nested `…/assets/` next to every note — prefixing with the note folder broke GitHub paths.
 */
export function resolveArtifactWikiAssetRepoPath(
  cleanPath: string,
  _markdownFilePath: string
): string {
  const trimmed = cleanPath.trim();
  if (trimmed.startsWith("assets/")) {
    return trimmed;
  }
  if (trimmed.includes("/")) {
    return `assets/${trimmed}`;
  }
  return `assets/${trimmed}`;
}

/**
 * Map a db repo-relative path (as used by `getContent`) to encoded `/db-assets/…` segments.
 * Strips a leading `assets/` or `public/` so files copied from `db/assets/` into `public/db-assets/` resolve.
 */
export function encodedDbAssetsUrlSuffixFromRepoPath(repoPath: string): string {
  const trimmed = repoPath.trim().replace(/^\/+/, "");
  const relative = trimmed.replace(/^(assets|public)\//, "");
  return relative
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}
