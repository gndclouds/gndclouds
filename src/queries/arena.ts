export const getArenaBlockData = async (blockId: string) => {
  // function implementation
};

// Ensure all necessary functions are exported

export async function getArenagramImages(): Promise<any[]> {
  const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
  if (!arenaAccessToken) {
    throw new Error(
      "ARENA_ACCESS_KEY is not set in the environment variables."
    );
  }

  const channelId = "arenagram-iykx83-ruio"; // Channel ID for Arenagram
  let allImages: any[] = []; // Explicitly typed as an array of any type
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://api.are.na/v2/channels/${channelId}/contents?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${arenaAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Arenagram images from Are.na: ${response.statusText}`
      );
    }

    const data = await response.json();
    const images = data.contents.filter(
      (content: any) => content.class === "Image"
    );
    allImages = allImages.concat(images);
    hasMore = data.contents.length > 0;
    page++;
  }

  // Sort images by newest to oldest
  allImages.sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return allImages.map((image: any) => ({
    id: image.id,
    title: image.title,
    image_url: image.image.display.url, // Assuming 'display' size is desired
    created_at: image.created_at,
    updated_at: image.updated_at,
  }));
}

export async function getCollectionData(): Promise<any[]> {
  const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
  if (!arenaAccessToken) {
    throw new Error(
      "ARENA_ACCESS_KEY is not set in the environment variables."
    );
  }

  const collectionId = "collections-r3pfcbxeb_q"; // Collection ID for other channels
  const response = await fetch(
    `https://api.are.na/v2/channels/${collectionId}`,
    {
      headers: {
        Authorization: `Bearer ${arenaAccessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch collection data from Are.na: ${response.statusText}`
    );
  }

  const data = await response.json();
  const collections = data.contents.filter(
    (content: any) => content.class === "Channel"
  );

  return collections.map((collection: any) => ({
    id: collection.id,
    title: collection.title,
    created_at: collection.created_at,
    updated_at: collection.updated_at,
  }));
}

export async function getArenaUserActivity(username: string): Promise<any[]> {
  // Your implementation here
  return [];
}

import axios from "axios";

// Define interfaces for Are.na API responses
interface ArenaChannel {
  id: number;
  title: string;
  slug: string;
  status: string;
  user_id: number;
  contents_count: number;
  created_at: string;
  updated_at: string;
  published: boolean;
  open: boolean;
  collaboration: boolean;
  collaborator_count: number;
  owner: {
    id: number;
    slug: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
    avatar_image: {
      thumb: string;
      display: string;
    };
  };
  class: string;
  base_class: string;
  user: {
    id: number;
    slug: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  total_pages: number;
  current_page: number;
  per: number;
  follower_count: number;
  can_index: boolean;
  nsfw: boolean;
}

interface ArenaBlock {
  id: number;
  title: string;
  updated_at: string;
  created_at: string;
  state: string;
  comment_count: number;
  generated_title: string;
  content: string;
  content_html: string;
  description: string;
  description_html: string;
  source: {
    url: string;
    title: string;
  };
  image: {
    filename: string;
    content_type: string;
    updated_at: string;
    thumb: {
      url: string;
    };
    square: {
      url: string;
    };
    display: {
      url: string;
    };
    large: {
      url: string;
    };
    original: {
      url: string;
      file_size: number;
      file_size_display: string;
    };
  };
  attachment: {
    url: string;
    file_name: string;
    extension: string;
    content_type: string;
  };
  embed: {
    type: string;
    title: string;
    author_name: string;
    author_url: string;
    provider_name: string;
    provider_url: string;
    thumbnail_url: string;
    html: string;
    width: number;
    height: number;
  };
  base_class: string;
  class: string;
  user: {
    id: number;
    slug: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  position: number;
  selected: boolean;
  connection_id: number;
  connected_at: string;
  connected_by_user_id: number;
  connected_by_username: string;
  connected_by_user_slug: string;
  channel: {
    id: number;
    title: string;
    slug: string;
  };
}

interface ArenaConnection {
  id: number;
  created_at: string;
  updated_at: string;
  channel_id: number;
  connectable_id: number;
  connectable_type: string;
  position: number;
  selected: boolean;
  user_id: number;
  username: string;
  user_slug: string;
  channel: {
    id: number;
    title: string;
    slug: string;
  };
  connectable: ArenaBlock;
}

export interface ArenaActivity {
  id: number;
  title: string;
  description: string;
  content: string;
  type: string;
  publishedAt: string;
  channelTitle: string;
  channelSlug: string;
  imageUrl?: string;
  sourceUrl?: string;
  embedHtml?: string;
  author: {
    username: string;
    avatar?: string;
  };
  uri: string;
}

/**
 * Fetches recent activity from an Are.na user
 * @param username The Are.na username to fetch activity for
 * @param limit The maximum number of items to fetch (default: 50)
 * @returns An array of formatted Are.na activity items
 */
export async function getArenaActivity(
  username: string,
  limit: number = 50
): Promise<ArenaActivity[]> {
  try {
    const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
    if (!arenaAccessToken) {
      console.error(
        "ARENA_ACCESS_KEY is not set in the environment variables."
      );
      return [];
    }

    console.log("Fetching Are.na activity for user:", username);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    try {
      // First, get the user's profile to verify the username and token
      const userResponse = await axios.get(
        `https://api.are.na/v2/users/${username}`,
        {
          headers: {
            Authorization: `Bearer ${arenaAccessToken}`,
          },
          timeout: 10000,
          signal: controller.signal,
        }
      );
      console.log(`Found Are.na user: ${userResponse.data.username}`);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Error fetching Are.na user profile:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "API response:",
          error.response.status,
          error.response.data
        );
      }
      return [];
    }

    // Get user's recent blocks directly with increased limit
    console.log(`Fetching recent blocks for ${username}...`);
    const blocksResponse = await axios.get(
      `https://api.are.na/v2/users/${username}/blocks?per=${limit}&sort=created_at&direction=desc`,
      {
        headers: {
          Authorization: `Bearer ${arenaAccessToken}`,
        },
        timeout: 15000,
        signal: controller.signal,
      }
    );

    let allBlocks: any[] = [];

    if (
      blocksResponse.data &&
      blocksResponse.data.blocks &&
      blocksResponse.data.blocks.length > 0
    ) {
      allBlocks = [...blocksResponse.data.blocks];
      console.log(`Found ${allBlocks.length} blocks directly from user API`);
    }

    // Approach 2: Also get contents from user's channels to ensure we have a comprehensive set
    console.log(`Fetching channels for ${username}...`);
    const channelsResponse = await axios.get(
      `https://api.are.na/v2/users/${username}/channels?per=30`,
      {
        headers: {
          Authorization: `Bearer ${arenaAccessToken}`,
        },
      }
    );

    if (channelsResponse.data && channelsResponse.data.channels) {
      const channels = channelsResponse.data.channels;
      console.log(`Found ${channels.length} channels for ${username}`);

      // Filter to only include open or shared channels
      const publicChannels = channels.filter(
        (channel: any) => channel.status === "public" || channel.open === true
      );
      console.log(
        `Found ${publicChannels.length} public/open channels out of ${channels.length} total`
      );

      // Sort channels by updated_at to get the most recently active ones
      const sortedChannels = publicChannels.sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      // Get contents from the most recently updated channels
      const channelsToFetch = sortedChannels.slice(0, 15); // Fetch from 15 most recent public channels

      for (const channel of channelsToFetch) {
        try {
          console.log(
            `Fetching contents from channel: ${channel.title} (${channel.status})`
          );
          const contentsResponse = await axios.get(
            `https://api.are.na/v2/channels/${channel.slug}/contents?per=30`,
            {
              headers: {
                Authorization: `Bearer ${arenaAccessToken}`,
              },
            }
          );

          if (contentsResponse.data && contentsResponse.data.contents) {
            // Filter for blocks only (not channels)
            const blocks = contentsResponse.data.contents.filter(
              (content: any) => content.base_class === "Block"
            );

            // Add channel info to each block
            blocks.forEach((block: any) => {
              block.channel = {
                title: channel.title,
                slug: channel.slug,
                status: channel.status,
                open: channel.open,
              };
            });

            allBlocks = [...allBlocks, ...blocks];
            console.log(`Found ${blocks.length} blocks in ${channel.title}`);
          }
        } catch (error) {
          console.error(
            `Error fetching contents for channel ${channel.title}:`,
            error
          );
        }
      }
    }

    // Filter blocks to only include those from public/open channels
    const publicBlocks = allBlocks.filter((block: any) => {
      // If the block has channel info, check if it's public/open
      if (block.channel) {
        return block.channel.status === "public" || block.channel.open === true;
      }

      // For blocks without channel info, we'll need to check their connections
      // For now, include them and we'll filter later if needed
      return true;
    });

    console.log(
      `Filtered to ${publicBlocks.length} blocks from public/open channels out of ${allBlocks.length} total blocks`
    );

    // Remove duplicates by ID
    const uniqueBlocks = Array.from(
      new Map(publicBlocks.map((block) => [block.id, block])).values()
    );

    // Sort blocks by created_at
    uniqueBlocks.sort(
      (a, b) =>
        new Date(b.connected_at || b.created_at).getTime() -
        new Date(a.connected_at || a.created_at).getTime()
    );

    // Limit to the requested number
    const limitedBlocks = uniqueBlocks.slice(0, limit);

    if (limitedBlocks.length === 0) {
      console.log("No blocks found");
      return [];
    }

    console.log(`Processing ${limitedBlocks.length} total blocks`);

    // Format the blocks - using any[] to handle the mixed return type with nulls
    const formattedActivityWithNulls: (ArenaActivity | null)[] =
      await Promise.all(
        limitedBlocks.map(async (block: any) => {
          // Determine the type of content
          let type = "arena";
          if (block.class === "Image") type = "arena-image";
          if (block.class === "Text") type = "arena-text";
          if (block.class === "Link") type = "arena-link";
          if (block.class === "Attachment") type = "arena-attachment";
          if (block.class === "Media") type = "arena-media";

          // Get channel info if not already present
          let channelTitle = block.channel?.title || "Personal Channel";
          let channelSlug = block.channel?.slug || username;
          let isPublic =
            block.channel?.status === "public" || block.channel?.open === true;

          if (!block.channel) {
            try {
              // Get the first channel this block is connected to
              const connectionsResponse = await axios.get(
                `https://api.are.na/v2/blocks/${block.id}/channels`,
                {
                  headers: {
                    Authorization: `Bearer ${arenaAccessToken}`,
                  },
                }
              );

              if (
                connectionsResponse.data &&
                connectionsResponse.data.channels &&
                connectionsResponse.data.channels.length > 0
              ) {
                // Find the first public channel
                const publicChannel = connectionsResponse.data.channels.find(
                  (ch: any) => ch.status === "public" || ch.open === true
                );

                if (publicChannel) {
                  channelTitle = publicChannel.title;
                  channelSlug = publicChannel.slug;
                  isPublic = true;
                } else {
                  // If no public channel found, skip this block
                  console.log(
                    `Skipping block ${block.id} - no public channel connection found`
                  );
                  return null;
                }
              }
            } catch (error) {
              console.error(
                `Error fetching channels for block ${block.id}:`,
                error
              );
              // Skip this block if we can't determine its publicity
              return null;
            }
          }

          // Skip if we determined this is not from a public channel
          if (!isPublic) {
            return null;
          }

          return {
            id: block.id,
            title: block.title || block.generated_title || "Untitled",
            description: block.description || "",
            content: block.content || "",
            type,
            publishedAt: block.connected_at || block.created_at,
            channelTitle,
            channelSlug,
            imageUrl: block.image?.display?.url,
            sourceUrl: block.source?.url,
            embedHtml: block.embed?.html,
            author: {
              username: username,
              avatar: block.user?.avatar,
            },
            uri: `https://www.are.na/block/${block.id}`,
          };
        })
      );

    // Filter out null values (blocks that were skipped)
    const formattedActivity: ArenaActivity[] =
      formattedActivityWithNulls.filter(
        (item): item is ArenaActivity => item !== null
      );

    console.log(
      `Formatted ${formattedActivity.length} Are.na activities for feed (from public/open channels only)`
    );
    return formattedActivity;
  } catch (error) {
    console.error("Error fetching Are.na activity:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "API response:",
        error.response.status,
        error.response.data
      );
    }
    return [];
  }
}
