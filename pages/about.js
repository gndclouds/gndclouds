import Link from "next/link";
import Layout from "../components/layout";
import Head from "next/head";
import { OG_NAME } from "../lib/constants";

const cvData = [
  {
    title: "daily",
    company: "daily",
    start: "",
    end: "",
    url: "words",
  },
  {
    title: "daily",
    company: "daily",
    start: "",
    end: "",
    url: "words",
  },
  {
    title: "daily",
    company: "daily",
    start: "",
    end: "",
    url: "words",
  },
];

export default function About() {
  // Create an image state
  // update when box is pressed

  return (
    <>
      <Layout>
        <Head>
          <title>{OG_NAME}</title>
        </Head>
        <p>hi,</p>
        <br />
        <p>this is will's corner of the 🌐.</p>
        <br />
        <p>
          he is currently building a monitoring and verification company for
          greenhouse gas emissions called{" "}
          <a href="https://anthropogenic.com">Anthropogenic</a>.
        </p>
        <br />
        <p>
          when not thinking, reading, or learning about the climate, he can be
          found climbing, hiking, forging, or building tiny electronics.
        </p>
        <br />

        <p>
          Preiviousely he worked as a design/developer in research groups at{" "}
          <a hfre="">Dark Matter Labs</a>, <a hfre="">Xero PARC</a>,{" "}
          <a hfre=""> Protocal Labs</a>, <a hfre="">IDEO</a>, <a>Intel</a>, and{" "}
          <a hfre="">Intel</a>
        </p>
      </Layout>
    </>
  );
}
