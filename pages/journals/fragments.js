import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../../lib/notion";
import { Text } from "../[id].js";
import Layout from "../../components/layout";

const pageData = {
  title: "fragments",
  ogDescription: "words",
  ogImage: "",
};

export default function Daily({ posts }) {
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
                  Get weekly articles in your inbox on how to grow your
                  business.
                </p>
              </div>
            </div>
            <div className='mt-6 pt-10 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12'></div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
