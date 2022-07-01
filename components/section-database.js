import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import PageHero from "../components/section-hero";

export default function Index({ allPosts, allNewsletters }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  const { asPath, pathname } = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const postData = allPosts.filter((postData) => {
    const searchContent = postData.title;
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });
  return (
    <>
      <Layout>
        <div className="bg-white pt-16 pb-20">
          <div className="text-xl">Recent Writting</div> 
          {!postData.length && "unable to load Posts"}
          {postData.map((postData, postDataIdx) => {
            const { title, slug } = postData;
            return (
              <div key={postDataIdx} className="block py-5">
                <div className="block my-1">
                  <Link
                    as={`/posts/${slug}`}
                    href="/posts/[slug]"
                    key={postDataIdx}
                  >
                    <a className="underline text-lg font-semibold">{title}</a>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
}
