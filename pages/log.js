import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Learning Log</title>
        <meta />
      </Head>

      <main>
        <p>logs</p>
        Loading from Notion
      </main>
    </Layout>
  );
}
