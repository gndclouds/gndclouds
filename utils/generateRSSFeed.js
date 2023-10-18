import fs from "fs";
import RSS from "rss";
import { allNotes } from "@/.contentlayer/generated";

export default async function generateRssFeed() {
  const site_url = "localhost:3000";

  const allPosts = await allNotes();

  const feedOptions = {
    title: "Blog posts | RSS Feed",
    description: "Welcome to this blog posts!",
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    image_url: `${site_url}/logo.png`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Ibas`,
  };

  const feed = new RSS(feedOptions);

  allPosts.map((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${site_url}/notes/${post.slug}`,
      date: post.publishedAt,
    });
  });

  fs.writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
}
