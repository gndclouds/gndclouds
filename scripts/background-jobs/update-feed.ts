/**
 * Background job to update feed data.
 * Uses the same pipeline as `npm run generate-feed` (all local content types included).
 *
 * - GitHub Actions (scheduled): `.github/workflows/update-feed.yml`
 * - Manual: `npm run update-feed`
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { generateFeedData } from "../generate-feed";

const startTime = Date.now();

generateFeedData()
  .then(() => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✨ Background job completed successfully (${duration}s)`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Background job failed:", error);
    process.exit(1);
  });
