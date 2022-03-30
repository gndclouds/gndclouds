import Link from "next/link";
import { useState } from "react";

import PageHero from "../components/section-hero";
import Layout from "../components/layout";

const quickLinks = {
  main: [
    { name: "blog", description: "webring ↗", href: "/blog" },
    { name: "logs", description: "webring ↗", href: "/newsletter" },
    {
      name: "/questions",
      description:
        "a list of open questions which I hope to better under stand throught my work",
      href: "/questions",
    },
  ],
};

export default function Thoughts() {
  return (
    <>
      <Layout>
        <PageHero PageDescription="My curiosity drives me to learn, read, and write. This blog is about a reflection of my mind and the mental threads I have been thinking about." />
      </Layout>
    </>
  );
}
