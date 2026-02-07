# gndclouds

## Deployment (Vercel)

For images to load in production and preview:

1. **GITHUB_ACCESS_TOKEN** – Required for journal/project images (asset-proxy fetches from the private `db` repo). Set for both **Production** and **Preview** in Vercel project settings.

2. **GIT_USERNAME** + **GIT_ACCESS_TOKEN** – Optional but recommended for the build. Used by `vercel-install.sh` to clone the `db` repo. If missing and the repo is private, `move-assets` will copy 0 files; images will still load via the asset-proxy if `GITHUB_ACCESS_TOKEN` is set.

3. **Regenerate feed** – After deploying, run `npm run generate-feed` and commit `public/data/feed.json` so Bluesky post images appear in the feed.

## Front Matter Requirements

Logs: title (required), categories, tags, type, publishedAt, published
Projects: title (required), categories, publishedAt, url
Journals: title (required), categories, tags, type, publishedAt, published
