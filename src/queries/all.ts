import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import fetch from "node-fetch";

export interface Post {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  type: string[];
  publishedAt: string;
  published: boolean;
  metadata: Record<string, any>;
}

export interface UnsplashImage {
  id: string;
  title?: string; // Added optional title property
  created_at: string;
  updated_at: string;
  alt_description?: string; // Added alt_description property
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  exif: {
    make: string;
    model: string;
    exposure_time: string;
    aperture: string;
    focal_length: string;
    iso: number;
  };
}

export interface ArenaItem {
  id: string;
  title: string;
  image: string | null;
  link: string | null;
  createdAt: string;
}

interface ArenaResponse {
  blocks?: Array<{ title: string; id: string; class: string }>;
  channels?: Array<{ title: string; id: string; class: string }>;
}

export interface ActivityHubItem {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  createdAt: string;
}

async function getMarkdownFilesRecursively(dir: string): Promise<string[]> {
  let files: string[] = [];
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      files = [...files, ...(await getMarkdownFilesRecursively(res))];
    } else if (res.endsWith(".md")) {
      files.push(res);
    }
  }
  return files;
}

export async function getAllMarkdownFiles(): Promise<Post[]> {
  const contentDir = "./src/app/db/content";
  const filePaths = await getMarkdownFilesRecursively(contentDir);

  const files = await Promise.all(
    filePaths.map(async (filePath) => {
      const { data: metadata } = matter(readFileSync(filePath, "utf8"));
      return {
        slug: filePath
          .substring(contentDir.length + 1)
          .replace(/\.md$/, "")
          .replace(/\//g, "-"),
        title: metadata.title,
        categories: metadata.categories || [],
        tags: metadata.tags || [],
        type: metadata.type || [],
        publishedAt: metadata.publishedAt || "",
        published: metadata.published || false,
        metadata: metadata,
      } as Post;
    })
  );

  // Sort posts by newest publishAt date
  return files.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const contentDir = "./src/app/db/content";
  const filePaths = await getMarkdownFilesRecursively(contentDir);
  const filePath = filePaths.find((path) => path.endsWith(`${slug}.md`));

  if (!filePath) {
    return null;
  }

  const { data: metadata } = matter(readFileSync(filePath, "utf8"));
  return {
    slug: filePath
      .substring(contentDir.length + 1)
      .replace(/\.md$/, "")
      .replace(/\//g, "-"),
    title: metadata.title,
    categories: metadata.categories || [],
    tags: metadata.tags || [],
    type: metadata.type || [],
    publishedAt: metadata.publishedAt || "",
    published: metadata.published || false,
    metadata: metadata,
  } as Post;
}

export async function getAllUnsplashImages(
  username: string
): Promise<UnsplashImage[]> {
  let page = 1;
  let images: UnsplashImage[] = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://api.unsplash.com/users/${username}/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&page=${page}&per_page=30`
    );

    if (!response.ok) {
      // Check if the response is not OK
      if (response.status === 429) {
        // Check if the status code is 429 (Rate Limit Exceeded)
        console.error("Rate limit exceeded. Please try again later.");
        break; // Exit the loop or handle as needed
      } else {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
    }

    const data = (await response.json()) as UnsplashImage[];
    images = images.concat(
      data.map((image) => ({
        id: image.id,
        title: image.title, // Now safely accessing title due to interface update
        created_at: image.created_at,
        updated_at: image.updated_at,
        alt_description: image.alt_description,
        urls: image.urls,
        exif: image.exif || {
          make: "",
          model: "",
          exposure_time: "",
          aperture: "",
          focal_length: "",
          iso: 0,
        },
      }))
    );
    hasMore = data.length === 30;
    page++;
  }

  return images.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getArenaUserActivity(
  username: string,
  pageSize: number = 20 // Default page size set to 20
): Promise<{ title: string; id: string; type: string }[]> {
  const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
  if (!arenaAccessToken) {
    throw new Error(
      "ARENA_ACCESS_KEY is not set in the environment variables."
    );
  }

  let page = 1;
  let hasMore = true;
  let allItems: { title: string; id: string; type: string }[] = [];
  let totalItemsFetched = 0;

  while (hasMore && totalItemsFetched < 5) {
    const response = await fetch(
      `https://api.are.na/v2/users/${username}/contents?access_token=${arenaAccessToken}&page=${page}&per_page=${pageSize}`
    );

    if (!response.ok) {
      console.error(`Failed to fetch data from Are.na: ${response.statusText}`);
      throw new Error(
        `Failed to fetch data from Are.na: ${response.statusText}`
      );
    }

    const data = (await response.json()) as ArenaResponse;
    const items = (data.blocks || []).concat(data.channels || []);
    allItems = allItems.concat(
      items.map((item: { title: string; id: string; class: string }) => ({
        title: item.title,
        id: item.id,
        type: item.class === "Channel" ? "channel" : "block",
      }))
    );

    totalItemsFetched += items.length;
    hasMore = items.length === pageSize && totalItemsFetched < 5; // Check if the number of items fetched equals the page size and total fetched is less than 5
    page++;
  }

  // console.log("Total Items fetched:", allItems.length);
  return allItems;
}

export async function getArenaBlockData(blockId: string): Promise<any> {
  const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
  if (!arenaAccessToken) {
    throw new Error(
      "ARENA_ACCESS_KEY is not set in the environment variables."
    );
  }

  const response = await fetch(
    `https://api.are.na/v2/blocks/${blockId}?access_token=${arenaAccessToken}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch block data from Are.na: ${response.statusText}`
    );
  }

  interface ArenaBlockResponse {
    id: string; // Added id property to resolve the error
    image?: {
      thumb: { url: string };
      square: { url: string };
      display: { url: string };
      large: { url: string };
      original: { url: string };
    };
    title: string;
    updated_at: string;
    created_at: string;
    description: string;
    sources?: Array<{ id: string; title: string; url: string }>;
    connections?: Array<{ id: string; title: string }>;
  }

  const data = (await response.json()) as ArenaBlockResponse;

  // Extracting image URLs from the new image format
  const images = data.image
    ? {
        thumb: data.image.thumb.url,
        square: data.image.square.url,
        display: data.image.display.url,
        large: data.image.large.url,
        original: data.image.original.url,
      }
    : {};

  return {
    title: data.title,
    updated_at: data.updated_at,
    created_at: data.created_at,
    description: data.description,
    source: data.sources
      ? data.sources.map(
          (source: { id: string; title: string; url: string }) => ({
            id: source.id,
            title: source.title,
            url: source.url,
          })
        )
      : [],
    images: images,
    id: data.id,
    connections: data.connections
      ? data.connections.map((connection: { id: string; title: string }) => ({
          id: connection.id,
          title: connection.title,
        }))
      : [],
  };
}

export async function getArenaChannelData(channelId: string): Promise<void> {
  const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
  if (!arenaAccessToken) {
    throw new Error(
      "ARENA_ACCESS_KEY is not set in the environment variables."
    );
  }

  const response = await fetch(
    `https://api.are.na/v2/channels/${channelId}?access_token=${arenaAccessToken}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch channel data from Are.na: ${response.statusText}`
    );
  }

  const data = await response.json();
  // console.log(data);
}

export async function getAllArenaChannelsForUser(
  userId: string
): Promise<any[]> {
  const arenaAccessToken = process.env.ARENA_ACCESS_KEY;
  if (!arenaAccessToken) {
    throw new Error(
      "ARENA_ACCESS_KEY is not set in the environment variables."
    );
  }

  const response = await fetch(
    `https://api.are.na/v2/users/${userId}/channels?access_token=${arenaAccessToken}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch channel data from Are.na: ${response.statusText}`
    );
  }

  interface ArenaChannelsResponse {
    channels: any[]; // Replace 'any' with a more specific type if known
  }

  const data = (await response.json()) as ArenaChannelsResponse;
  return data.channels;
}

// all feed data
export async function getActivityHubData(
  username: string
): Promise<ActivityHubItem[]> {
  const arenaData = await getArenaUserActivity(username);
  const unsplashData = await getAllUnsplashImages(username);

  const combinedData = [...arenaData, ...unsplashData].map((item) => ({
    id: item.id,
    title: item.title || "No title",
    imageUrl: "urls" in item ? item.urls.regular : item.image,
    link: item.link || null,
    createdAt: "created_at" in item ? item.created_at : item.createdAt,
  }));

  return combinedData.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
