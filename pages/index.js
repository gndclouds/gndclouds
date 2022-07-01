import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import Emissions from "../components/a";
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
      title: "Anthropogenic",
      description: "Co-running a community of",
      href: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
    {
      title: "Tiny Factories",
      description: "Co-running a community of",
      href: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
    {
      title: "Dark Matter Labs",
      description: "Co-running a community of",
      href: "Tiny Factories",
      time: "https://tinyfactories.space",
    },
  ];

  const ReadingData = [
    {
      title: "EarthSea Series",
      description: "Co-running a community of",
      href: "Tiny Factories",
      img: "https://tinyfactories.space",
    },
    {
      title: "Co-running a community of",
      description: "Co-running a community of",
      href: "Tiny Factories",
      img: "https://tinyfactories.space",
    },
    {
      title: "Co-running a community of",
      description: "Co-running a community of",
      href: "Tiny Factories",
      img: "https://tinyfactories.space",
    },
    {
      title: "Co-running a community of",
      description: "Co-running a community of",
      href: "Tiny Factories",
      img: "https://tinyfactories.space",
    },
  ];

  return (
    <>
      <Layout>
        <Head>
          <title>{OG_NAME}</title>
        </Head>
        <div className="py-8">
          <div className="col-span-3 bg-[#2E2E2E] rounded">
            <div className=" inset-0">
              {/* <img
              className="h-1/2 w-full object-cover"
              src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"
              alt="People working on laptops"
            /> */}
            </div>
            {/* <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8 bg-backgroundlight dark:bg-backgrounddark text-textlight dark:text-textdark ">
              <div className="text-xl font-bold">
                reducing human-generated emissions
              </div>
            </div> */}
          </div>
          {/* <div className="flex py-1 ">
            {hero.map((d) => (
              <div className="pr-4 h-6 w-6 border-[#AFCFC5] rounded rounded border-2"></div>
            ))}
          </div> */}
        </div>
        {/* <div className="py-8">
          <div className="flex flex-auto text-mono uppercase  border-backgrounddark dark:border-backgroundlight border-b-2 mb-3">
            <div className="">Things</div>
          </div>
          ​
          <div className="grid grid-cols-3 gap-4">
            {hero.slice(0, 3).map((d, i) => {
              const { title, description, href } = d;
              return (
                <div key={i} className="">
                  <Link href={href} key={i}>
                    <a className="">
                      <div className="">{title}</div>
                      <div className="">{description}</div>
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div> */}

        <div className="py-8">
          <div className="flex flex-auto text-mono uppercase  border-backgrounddark dark:border-backgroundlight border-b-2 mb-3">
            <div className="">Hey Hi Hello</div>
          </div>
          <div className="">
            <div className="">
              Currently focused on decarbonizing human system at{" "}
              <Link href="https://www.anthopogenic.com">
                <a>Anthopogenic</a>
              </Link>
              , exploring decentralized governance at{" "}
              <Link href="https://www.darkmatterlabs.org">
                <a>Dark Matter Labs</a>
              </Link>{" "}
              co-running a community of{" "}
              <Link href="https://www.tinyfactories.space">
                <a>Tiny Factories</a>
              </Link>
              .
              <br />
              <br />
              My past roles have been a mix of research, design, and front-end
              development at research labs within IDEO, PARC, Intel, Fjord, and
              Protocol Labs.
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="flex flex-auto text-mono uppercase  border-backgrounddark dark:border-backgroundlight border-b-2 mb-3">
            <div>Thoughts</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {postData.slice(0, 5).map((d, i) => {
              const { title, description, slug, image } = d;
              return (
                <div key={i} className="">
                  <Link as={`/posts/${slug}`} href="/posts/[slug]" key={i}>
                    <a className="">
                      {/* <div className="rounded bg-red">image</div> */}
                      {title}
                      {description}
                    </a>
                  </Link>
                </div>
              );
            })}
            <Link href="/blog">
              <a className=" border-2 border-black col-span-3 items-center justify-between">
                read more
              </a>
            </Link>
          </div>
        </div>
        {/* <div className="py-8">
          <div className="flex flex-auto text-mono uppercase border-b-2">
            <div>readings</div>
            <div>↗</div>
          </div>
          <div className="grid grid-row-3 gap-4">
            {ReadingData.map((d, i) => {
              const { title, href } = d;
              return (
                <Link key={i} href={href}>
                  <a className="">{title}</a>
                </Link>
              );
            })}
          </div>
        </div> */}
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
