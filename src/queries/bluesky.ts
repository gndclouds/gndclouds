import { BskyAgent, AppBskyFeedDefs } from "@atproto/api";

export interface BlueskyPost {
  id: string;
  text: string;
  publishedAt: string;
  type: string;
  uri: string;
  cid: string;
  author: {
    handle: string;
    displayName?: string;
    avatar?: string;
  };
  indexedAt: string;
  likeCount: number;
  repostCount: number;
  isRepost: boolean;
  reason?: {
    by: {
      did: string;
      handle: string;
      displayName?: string;
    };
  };
}

// Define the interface for the feed item
interface FeedItem {
  post: {
    uri: string;
    cid: string;
    record: {
      text: string;
      [key: string]: any;
    };
    author: {
      handle: string;
      displayName?: string;
      avatar?: string;
    };
    indexedAt: string;
    likeCount?: number;
    repostCount?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export async function getBlueskyPosts(handle: string): Promise<BlueskyPost[]> {
  try {
    const agent = new BskyAgent({ service: "https://bsky.social" });

    // Check if environment variables are available
    const username = process.env.BLUESKY_USERNAME;
    const password = process.env.BLUESKY_APP_PASSWORD;

    if (!username || !password) {
      console.error("Bluesky credentials not found in environment variables");
      return [];
    }

    // Login to Bluesky
    try {
      await agent.login({
        identifier: username,
        password: password,
      });
      console.log("Successfully logged in to Bluesky as:", username);
    } catch (loginError) {
      console.error("Bluesky login error:", loginError);
      return [];
    }

    // Format handle properly - ensure it has the domain if not already present
    let formattedHandle = handle;
    if (!handle.includes(".")) {
      formattedHandle = `${handle}.bsky.social`;
    }

    console.log("Resolving Bluesky handle:", formattedHandle);

    // Resolve the DID for the provided handle
    try {
      const { data: resolveData } = await agent.resolveHandle({
        handle: formattedHandle,
      });

      const did = resolveData.did;
      console.log("Resolved DID:", did);

      // Get the user's posts
      const { data } = await agent.getAuthorFeed({
        actor: did,
        limit: 30,
      });

      console.log(`Retrieved ${data.feed.length} posts from Bluesky`);

      // Transform the posts into our format
      return data.feed.map((item) => {
        const post = item.post;
        const record = post.record as { text: string; [key: string]: unknown };

        // Check if this is a repost
        const isRepost =
          !!item.reason &&
          item.reason.$type === "app.bsky.feed.defs#reasonRepost";

        return {
          id: post.uri.split("/").pop() || "",
          text: record.text || "",
          publishedAt: post.indexedAt,
          type: "Bluesky",
          uri: post.uri,
          cid: post.cid,
          author: {
            handle: post.author.handle,
            displayName: post.author.displayName,
            avatar: post.author.avatar,
          },
          indexedAt: post.indexedAt,
          likeCount: post.likeCount || 0,
          repostCount: post.repostCount || 0,
          isRepost: isRepost,
          reason: isRepost
            ? {
                by: {
                  did: (item.reason as any).by.did,
                  handle: (item.reason as any).by.handle,
                  displayName: (item.reason as any).by.displayName,
                },
              }
            : undefined,
        };
      });
    } catch (error) {
      console.error("Error fetching Bluesky data:", error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching Bluesky posts:", error);
    return [];
  }
}
