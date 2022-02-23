import Link from "next/link";
import { useState } from "react";

import { useRouter } from "next/router";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import { OG_NAME } from "../lib/constants";

const quickLinks = {
  main: [
    { name: "blog", description: "webring ↗", href: "/blog" },
    { name: "logs", description: "webring ↗", href: "/newsletter" },
    {
      name: "/questions",
      description:
        "a list of open questions which I hope to better under stand throught my work",
      href: "/questions",
    },
  ],
};

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
        <div className='bg-white pt-16 pb-20'>
          <h2 className='text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl'>
            {pathname}
          </h2>
          <p className='text-lg py-3'>
            My curiosity drives me to learn, read, and write. This blog is about
            a reflection of my mind and the mental threads I have been thinking
            about.
          </p>
          <div className='grid grid-cols-3 gap-3'>
            {quickLinks.main.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className='rounded border-2 px-4 py-4'>
                  <div>{item.name}</div>
                  <div>{item.description}</div>
                </a>
              </Link>
            ))}
          </div>
          {/*           <div className=''>
            List of posts via *new compoentn* Click or listen to psit from ehre
            <Link href='posts'>
              <a>View More →</a>
            </Link>
          </div>
          <div className='text-xl'>Logs</div>
          <div className=''>
            List of posts via *new compoentn*
            <Link href='/daily'>
              <a>View More →</a>
            </Link>
          </div>
          <div className='text-xl'>Questions</div>
          <div className=''>
            List of posts via *new compoentn*
            <Link href='/questions'>
              <a>View More →</a>
            </Link>
          </div> */}
          <div className='text-xl'>Recent Writting</div> 
          {!postData.length && "unable to load Posts"}
          {postData.map((postData, postDataIdx) => {
            const { title, slug } = postData;
            return (
              <div key={postDataIdx} className='block py-5'>
                <div className='block my-1'>
                  <Link
                    as={`/posts/${slug}`}
                    href='/posts/[slug]'
                    key={postDataIdx}
                  >
                    <a className='underline text-lg font-semibold'>{title}</a>
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
