import Link from "next/link";
import { useState } from "react";

import PageHero from "../components/section-hero";
import Layout from "../components/layout";

const quickLinks = [
  {
    name: "blogs",
    description: "webring ↗",
    href: "/blog",
    color: "border-indigo-600 rounded border-2 px-4 py-4",
    font: "",
  },
  {
    name: "journals",
    description: "webring ↗",
    href: "/journals",
    color: "border-indigo-600 rounded border-2 px-4 py-4",
    font: "",
  },
  {
    name: "questions",
    description:
      "a list of open questions which I hope to better under stand throught my work",
    href: "/questions",
    color: "border-indigo-600 rounded border-2 px-4 py-4",
    font: "",
  },
];

export default function Thoughts() {
  return (
    <>
      <Layout>
        <PageHero
          PageDescription="... My curiosity drives me to learn, read, and write. This blog is about a reflection of my mind and the mental threads I have been thinking about."
          quickLinks={quickLinks}
        />
      </Layout>
    </>
  );
}
