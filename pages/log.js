import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout";

import { logs } from "../data/logs";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Learning Log</title>
        <meta />
      </Head>

      <main>
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
      </main>
    </Layout>
  );
}
