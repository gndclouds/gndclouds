import Link from "next/link";
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
    { name: "Projects", description: "webring ↗", href: "/blog" },
    { name: "Books", description: "webring ↗", href: "/newsletter" },
    { name: "CV", description: "webring ↗", href: "/" },
  ],
};

export default function Index({ allPosts }) {
  const { asPath, pathname } = useRouter();
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  return (
    <>
      <Layout>
        <div className='bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8'>
          <h2 className='text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl'>
            {pathname}
          </h2>
          <p>
            Recent work has focused on building small tools for the indie web
            through Tiny Factories and climate research projects with oh dot
            zero. I have chosen to grow generalist skills across research,
            design, and development while becoming a specialist in specific
            topics.
          </p>
          <section className='flex space-x-4'>
            {quickLinks.main.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className='rounded border-2 px-4 py-4'>
                  <div>{item.name}</div>
                  <div>{item.description}</div>
                  {item.name}
                </a>
              </Link>
            ))}
          </section>
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
