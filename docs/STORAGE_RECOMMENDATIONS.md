# Storage Recommendations for Feed Data

## Current Approach: JSON Files ✅

**JSON is the best choice for this use case** because:

1. **Fast & Simple**: Direct file reads, no database overhead
2. **Human Readable**: Easy to debug and inspect
3. **Static Site Friendly**: Works perfectly with Next.js static generation
4. **Version Control**: Can be committed to git for history
5. **No Dependencies**: Built into Node.js, no extra packages needed
6. **TypeScript Friendly**: Easy to type and validate

## File Structure

```
public/data/
├── feed.json          # Main feed data (all sources combined)
├── cv.json            # CV data
├── education.json     # Education data
├── press-awards.json  # Press & awards
└── social.json        # Social links
```

## Alternative Options (Not Recommended)

### SQLite

- **Pros**: Queryable, structured, good for complex relationships
- **Cons**:
  - Overkill for read-only static data
  - Requires database library
  - Harder to version control
  - Slower for simple reads
- **When to use**: If you need complex queries or relationships between data

### CSV

- **Pros**: Simple, spreadsheet-friendly
- **Cons**:
  - Not good for nested data (your feed has nested objects)
  - No type safety
  - Harder to work with in JavaScript
- **When to use**: Simple flat data only

### YAML

- **Pros**: Human-readable, supports comments
- **Cons**:
  - Slower to parse than JSON
  - Requires extra dependency
  - Less common in JavaScript ecosystem
- **When to use**: Configuration files, not data files

## Background Job Architecture

### How It Works

1. **Background Jobs** (`scripts/background-jobs/update-feed.ts`)

   - Fetches data from all sources (Unsplash, Bluesky, Arena, GitHub, local files)
   - Combines and processes all data
   - Writes to `public/data/feed.json`

2. **Scheduled Execution**

   - **GitHub Actions**: Monthly updates (`.github/workflows/update-feed.yml`)
   - **Vercel Cron**: Every 15 minutes (`vercel.json`)
   - **Manual**: `npm run update-feed`

3. **Feed Page** (`src/app/feed/page.tsx`)
   - Always reads from `public/data/feed.json`
   - No API calls on page load
   - Fast, static file read

### Benefits

- ✅ **Fast Page Loads**: No API calls, just file reads
- ✅ **Reliable**: Background jobs can retry, don't block page loads
- ✅ **Scalable**: Can handle large datasets without impacting users
- ✅ **Debuggable**: JSON files are easy to inspect and modify

## Data Flow

```
External APIs (Unsplash, Bluesky, etc.)
    ↓
Background Job Script (update-feed.ts)
    ↓
public/data/feed.json (JSON file)
    ↓
Feed Page (reads JSON file)
    ↓
User sees feed
```

## Recommendations

1. **Keep using JSON** - It's perfect for your use case
2. **Store all items** - Don't filter during generation, filter on read
3. **Version control** - Commit `feed.json` to git for history
4. **Background jobs** - Use scheduled jobs, not on-demand API calls
5. **Error handling** - Store errors in the JSON so you can see what failed
