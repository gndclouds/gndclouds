import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";

import Head from "next/head";
import { OG_NAME } from "../lib/constants";
import { books } from "../data/books";
import { logs } from "../data/logs";

import WilliamFelker from "../public/assets/williamfelker.JPG";

export default function Index({ allPosts }) {
  const { asPath, pathname } = useRouter();

  return (
    <>
      <Layout>
        <Head>
          <title>{OG_NAME}</title>
        </Head>
        <div className="py-8 font-sans">
          <div className="grid  grid-cols-3 grid-rows-9 gap-4">
            <h1 className="bg-backgroundmid text-xl col-span-3 p-5 rounded border font-serif">
              Mitigating human-generated emissions Anthropogenic building a
              community Tiny Factories
            </h1>

            <div className="bg-backgroundmid p-5 rounded border ">
              <span className="uppercase">things:</span>
              <ul>
                {allPosts.slice(0, 5).map((d, i) => {
                  const { title, description, slug, image } = d;
                  return (
                    <li key={i} className="block">
                      <Link as={`/posts/${slug}`} href="/posts/[slug]">
                        <a className=" flex hover:translate-x-1 transform-gpu">
                          <div className="inline pr-1">→</div>
                          <div className="inline">{title}</div>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-backgroundmid col-span-2 p-5 rounded ">
              <span className="uppercase">thoughts:</span>
              <ul>
                {allPosts.slice(0, 5).map((d, i) => {
                  const { title, description, slug, image } = d;
                  return (
                    <li key={i} className="block">
                      <Link as={`/posts/${slug}`} href="/posts/[slug]">
                        <a className=" flex hover:translate-x-1 transform-gpu">
                          <div className="inline pr-1">→</div>
                          <div className="inline">{title}</div>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-backgroundmid col-span-3 p-5 rounded border">
              <span className="uppercase">logs:</span>
              {logs.slice(0, 5).map((d, i) => {
                const { time, comment, source } = d;
                return (
                  <li key={i} className="block">
                    <Link as={`${source}`} href="/posts/[slug]">
                      <a className=" flex ">
                        <div className="inline pr-1">{time}</div>
                        <div className="inline">{comment}</div>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </div>

            <div className="bg-backgroundmid col-span-3 p-5 rounded border">
              <span className="uppercase">reading:</span>
              <div className="snap-start snap-x flex snap-mandatory mx:auto min-h-fit overflow-y-hidden">
                {books.slice(0, 5).map((d, i) => {
                  const {
                    title,
                    author,
                    cover,
                    goodreadsHref,
                    okuHref,
                    rating,
                  } = d;
                  return (
                    <div
                      key={i}
                      className="snap-start grid min-w-[250px]  place-items-center rounded border m-5"
                    >
                      <Link as={goodreadsHref} href={"/posts"}>
                        <a className="">
                          <Image
                            src={cover}
                            alt={`Book Cover for ${title}`}
                            width={50}
                            height={50}
                          />
                          <div className="">{title}</div>
                        </a>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-backgroundmid col-span-3 p-5 rounded">
              Dwelling in San Francisco
            </div>
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
