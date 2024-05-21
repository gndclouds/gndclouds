import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPostBySlug } from "@/queries/all";

type Post = {
  title: string;
  metadata: {
    contentHtml: string;
    [key: string]: any; // for flexibility
  };
};

export default function LogPage() {
  const router = useRouter();
  const { slug } = router.query; // `slug` is an array of path segments
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (slug) {
        const postSlug = Array.isArray(slug) ? slug.join("-") : slug;
        try {
          const fetchedPost = await getPostBySlug(postSlug);
          setPost(fetchedPost);
        } catch (error) {
          console.error("Failed to fetch post:", error);
        }
      }
    }

    fetchPost();
  }, [slug]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.metadata.contentHtml }} />
    </div>
  );
}
