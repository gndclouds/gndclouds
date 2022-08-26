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
      description: "Working",
      href: "https://anthropogenic.com",
      time: "2021 to Present",
      logo: "https://tinyfactories.space",
      color: "",
    },
    {
      title: "Tiny Factories",
      description:
        "a tribe of creatives, consisting of indiepreneurs, coders, artists, designers, musicians, videographers, writers, animators (and more) supporting each other in establishing both creative autonomy and financial stability.",
      href: "2019 to Present",
      time: "https://tinyfactories.space",
      logo: "",
      color: "",
    },
    {
      title: "Dark Matter Labs",
      description:
        "A design technologist with a principal interest is creating interventions for the rapid decarbonization of the earth. Through better understanding how natural systems work, he hopes to help shift how we think about systems so they can better evolve with us and the planet.",
      href: "https://darkmatterlabs.org",
      time: "2021 to 2022",
      logo: "",
      color: "",
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
            {/* <div className=" inset-0">
              <img
                className="h-1/2 w-full object-cover"
                src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"
                alt="People working on laptops"
              />
            </div> */}
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8 bg-backgroundlight dark:bg-backgrounddark text-textlight dark:text-textdark ">
              <div className="text-xl font-bold">
                learning how to build systems which support the health of
                bioregions
              </div>
            </div>
          </div>
          <div className="flex py-1 ">
            {hero.map((d) => (
              <div className="pr-4 h-6 w-6 border-[#AFCFC5] rounded rounded border-2"></div>
            ))}
          </div>
        </div>
        <div className="py-8">
          <div className="flex flex-auto text-mono uppercase  border-backgrounddark dark:border-backgroundlight border-b-2 mb-3">
            <div className="font-bold">Places</div>
          </div>
          ​
          <div className="grid grid-cols-3 gap-4">
            {hero.slice(0, 3).map((d, i) => {
              const { title, description, href } = d;
              return (
                <div key={i} className="">
                  <Link href={href} key={i}>
                    <a className="">
                      <span className="font-bold">{title} ↗</span>
                      <div className="">{description}</div>
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="py-8">
          <div className="flex flex-auto text-mono uppercase  border-backgrounddark dark:border-backgroundlight border-b-2 mb-3">
            <div className="font-bold">Thoughts</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {postData.slice(0, 5).map((d, i) => {
              const { title, description, slug, image } = d;
              return (
                <div key={i} className="">
                  <Link as={`/posts/${slug}`} href="/posts/[slug]" key={i}>
                    <a className="">
                      <div className="rounded bg-red">
                        <Image
                          src={image}
                          alt="Picture of the author"
                          width={500}
                          height={500}
                        />
                      </div>
                      <span className="font-bold">{title} </span>
                      {description}
                    </a>
                  </Link>
                </div>
              );
            })}
            <div className="">
              <Link href="/blog">
                <a className="">
                  <div className="rounded bg-red">Gray Box</div>
                  read more
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="py-8">
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
