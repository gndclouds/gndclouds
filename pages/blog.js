import { useState } from "react";
import { useRouter } from "next/router";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import Link from "next/link";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import { OG_NAME } from "../lib/constants";

export default function Index({ allPosts }) {
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
        <Head>
          <title>
            {OG_NAME} {asPath}
          </title>
        </Head>
        <Container>
          <div>
            {" "}
            <input
              aria-label='Search'
              type='text'
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='Search'
              className='block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-900 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100'
            />
          </div>

          {!postData.length && "No Laws found."}

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
        </Container>
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
