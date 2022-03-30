import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import { OG_NAME } from "../lib/constants";

export default function Index({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  const [searchValue, setSearchValue] = useState("");

  const { asPath, pathname } = useRouter();

  const postData = allPosts.filter((postData) => {
    const searchContent = postData.title;
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  const hero = [
    {
      blurb: "Co-running a community of",
      alt: "Co-running a community of",
      source: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
    {
      blurb: "Co-running a community of",
      alt: "Co-running a community of",
      source: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
    {
      blurb: "Co-running a community of",
      alt: "Co-running a community of",
      source: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
    {
      blurb: "Co-running a community of",
      alt: "Co-running a community of",
      source: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
    {
      blurb: "Co-running a community of",
      alt: "Co-running a community of",
      source: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
    {
      blurb: "Co-running a community of",
      alt: "Co-running a community of",
      source: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
  ];

  const intros = [
    {
      blurb: "Reducing human generated emissions at",
      company: "Anthropogenic",
      href: "https://anthropogenic.com",
      color: "border-indigo-600 rounded border-2 px-4 py-4",
      font: "",
      current: true,
    },
    {
      blurb: "Exploring contracting with care at",
      company: "Dark Matter Labs",
      href: "https://darkmatterlabs.org",
      color: "border-indigo-600 rounded border-2 px-4 py-4",
      font: "",
      current: true,
    },
    {
      blurb: "Co-running a community of",
      company: "Tiny Factories",
      href: "https://tinyfactories.space",
      color: "border-indigo-600 rounded border-2 px-4 py-4",
      font: "",
      current: true,
    },
  ];

  // Create an image state
  // update when box is pressed

  return (
    <>
      <Layout>
        <Head>
          <title>{OG_NAME}</title>
        </Head>
        <div className="pb-5">
          <div className="col-span-3 border-indigo-600 rounded border-2">
            <div className=" inset-0">
              {/* <img
              className="h-1/2 w-full object-cover"
              src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"
              alt="People working on laptops"
            /> */}
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <div className="text-xl font-bold">IDK</div>
            </div>
          </div>
          <div className="flex py-1 ">
            {hero.map((d) => (
              <div className="pr-4 h-6 w-6 border-indigo-600 rounded border-2"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {intros.map((intro) => (
            <Link key={intro.name} href={intro.href}>
              <a className={intro.color}>
                <div className="">
                  {intro.blurb} {intro.company} ↗
                </div>
              </a>
            </Link>
          ))}
          <div className="col-span-2 border-indigo-600 rounded border-2 px-4 py-4">
            Reading Now
          </div>
          <div className="border-indigo-600 rounded border-2 px-4 py-4">
            Listening Now
          </div>
          <div className="border-indigo-600 rounded border-2 px-4 py-4">
            Born at 357 PPM, today we are at 419.05 PPM
          </div>
          <div className="col-span-2 border-indigo-600 rounded border-2 px-4 py-4">
            Reading Now
          </div>
          <div className="col-span-2 border-indigo-600 rounded border-2 px-4 py-4">
            Tweeting About
          </div>
          <div className="border-indigo-600 rounded border-2 px-4 py-4">
            Newsletter
          </div>
          {/* <div className="col-span-3 border-indigo-600 rounded border-2 px-4 py-4">
            Recent Thoughts
            {!postData.length && "No Laws found."}
            <div className="grid grid-cols-3 gap-4">
              {postData.map((postData, postDataIdx) => {
                const { title, slug } = postData;
                return (
                  <div
                    key={postDataIdx}
                    className="border-indigo-600 rounded border-2 px-4 py-4"
                  >
                    <Link
                      as={`/posts/${slug}`}
                      href="/posts/[slug]"
                      key={postDataIdx}
                    >
                      <a className="underline">{title}</a>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div> */}
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
