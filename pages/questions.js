import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text } from "./[id].js";
import Layout from "../components/layout";

export const databaseId = process.env.NOTION_DATABASE_GNDCLOUDS_QUESTIONS;

const pageData = {
  title: "questions",
  ogDescription:
    "I keep a list of open question which I hope to better understand through conversation with others and my work.",
  ogImage: "",
};

export default function Questions({ posts }) {
  const [searchValue, setSearchValue] = useState("");

  const questionData = posts.filter((questionData) => {
    const searchContent = questionData.properties.Name.title;
    return searchContent.toString().includes(searchValue.toLowerCase());
  });
  return (
    <Layout>
      <Head>
        <title>{pageData.title}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div className='bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8'>
          <div className='relative max-w-lg mx-auto divide-y-2 divide-gray-200 lg:max-w-7xl'>
            <div>
              <h2 className='text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl'>
                {pageData.title}
              </h2>
              <div className='mt-3 sm:mt-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-center'>
                <p className='text-xl text-gray-500'>
                  {pageData.ogDescription}
                </p>
              </div>
              <input
                aria-label='Search'
                type='text'
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder='Search'
                className='block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-900 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100'
              />
            </div>
            <div className='mt-6 pt-10 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12'>
              {!questionData.length && "No Laws found."}

              {questionData.map((questionData, questionDataIdx) => {
                const { title } = questionData;
                const date = new Date(
                  questionData.last_edited_time
                ).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                });
                return (
                  <div key=''>
                    <p className='text-sm text-gray-500'>
                      <time dateTime='2020-02-12'>{date}</time>
                    </p>

                    <Link href={`/${questionData.id}`}>
                      <a className='mt-2 block'>
                        <Text text={questionData.properties.Name.title} />
                      </a>
                    </Link>

                    <a href='#' className='mt-2 block'>
                      <p className='text-xl font-semibold text-gray-900'></p>
                      <p className='mt-3 text-base text-gray-500'></p>
                    </a>
                    <div className='mt-3'>
                      <Link href={`/${questionData.id}`}>
                        <a className='text-base font-semibold text-indigo-600 hover:text-indigo-500'>
                          {" "}
                          Read post →
                        </a>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
