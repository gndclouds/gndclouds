import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Layout from "../../components/layout";
import { getAllPosts } from "../../lib/api";
import Head from "next/head";
import { OG_NAME } from "../../lib/constants";

export default function Index({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  const { asPath, pathname } = useRouter();
  const [searchValue, setSearchValue] = useState("");

  {
    /* const postData = allPosts.filter((postData) => {
    const searchContent = postData.title;
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  }); */
  }

  return (
    <>
      <Layout>
        {/* <div>
          {" "}
          <input
            aria-label="Search"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-900 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div> */}

        <div className="grid grid-cols-3 gap-4">
          {allPosts.map((d, i) => {
            const { title, description, slug, image, coverImage } = d;
            return (
              <div key={i} className="">
                <Link as={`/posts/${slug}`} href="/posts/[slug]" key={i}>
                  <a className="">
                    <div className="rounded bg-gray-100 h-64">
                      {" "}
                      <Image
                        src={coverImage}
                        alt="Picture of the author"
                        width={500}
                        height={500}
                      />
                    </div>
                    {title}
                    {description}
                  </a>
                </Link>
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
