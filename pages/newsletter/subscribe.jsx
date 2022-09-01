import Head from "next/head";
import Layout from "../../components/layout";
import { OG_NAME } from "../../lib/constants";

export default function Subscribe() {
  return (
    <>
      <Layout>
        <Head>
          <title>{OG_NAME}</title>
        </Head>
        <div className="flex flex-wrap"></div>
      </Layout>
    </>
  );
}
