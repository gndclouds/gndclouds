import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";

import Head from "next/head";
import { OG_NAME } from "../lib/constants";
import WilliamFelker from "../public/assets/williamfelker.jpg";

export default function Index({ allPosts }) {
  const [searchValue, setSearchValue] = useState("");
  const { asPath, pathname } = useRouter();

  const postData = allPosts.filter((postData) => {
    const searchContent = postData.title;
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <>
      <Layout>
        <Head>
          <title>{OG_NAME}</title>
        </Head>
        <div className="py-8">
          <div className="grid gap-4 grid-cols-3 grid-rows-3">
            <div className="bg-backgroundmid col-span-3 p-10 rounded">
              Mitigating human-generated emissions Anthropogenic building a
              community Tiny Factories
            </div>

            <div className="bg-backgroundmid row-span-3 col-span-2 p-10 rounded">
              writting
              <ul>
                {postData.slice(0, 3).map((d, i) => {
                  const { title, description, slug, image } = d;
                  return (
                    <li key={i} className="">
                      <Link as={`/posts/${slug}`} href="/posts/[slug]" key={i}>
                        <a className="">
                          <span className="">{title} </span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="bg-backgroundmid row-span-3 relative rounded">
              <Image
                src={WilliamFelker}
                alt="william felker in 2022"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
            <div className="bg-backgroundmid p-10 rounded row-span-2">
              building
            </div>
            <div className="bg-backgroundmid col-span-2 p-10 rounded">
              <span>Reading</span>
              <ul>
                <li className="hover:translate-x-6 transform-gpu">
                  Planetary Mine: Territories of Extraction under Late
                  Capitalism
                </li>
                <li className="hover:translate-x-6 transform-gpu">
                  Ways of Being: Beyond Human Intelligence
                </li>
                <li className="hover:translate-x-6 transform-gpu">
                  A Pattern Language: Towns, Buildings, Construction
                </li>
              </ul>
            </div>

            <div className="bg-backgroundmid col-span-3 p-10 rounded">
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
