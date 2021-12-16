import Link from "next/link";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import { CMS_NAME } from "../lib/constants";

export default function Index({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  return (
    <>
      <Layout>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <div className='bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8'>
          <h2 className='text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl'>
            Page Title
          </h2>
          <p>
            My curiosity drives me to learn, read, and write. This blog is about
            a reflection of my mind and the mental threads I have been thinking
            about.
          </p>
          <section className='flex space-x-4'>
            <div className='rounded border-2 px-4 py-4'>
              <div>title</div>
              <div>description</div>
            </div>
            <div className='rounded border-2 px-4 py-4'>
              <div>title</div>
              <div>description</div>
            </div>
            <div className='rounded border-2 px-4 py-4'>
              <div>title</div>
              <div>description</div>
            </div>
          </section>
          <div className='text-xl'>Posts</div>
          <div className=''>
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
          </div>
          Make notion a compoents for each Page  
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
