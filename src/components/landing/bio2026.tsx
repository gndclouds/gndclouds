import Link from "next/link";
import {
  bioLinkClassTight,
  bioProseGridClass,
} from "@/components/landing/bio-shared";

const Bio2026 = () => {
  const linkClass = bioLinkClassTight;

  const paragraphs = [
    <div key="intro">
      Hello, {"I'm"} Will. Welcome to my corner of the internet.
    </div>,
    <div key="focus">
      <span className="font-bold">My focus</span> for the next decade is
      contributing to work that makes critical elements of natural systems
      visible, I refer to this as making the unseen-seen. This means changing
      how we see ourselves as part of nature rather than adjacent to it.
    </div>,
    <div key="role">
      These days, I do this to grow my understanding of biology and the build
      environments through my personal practice at{" "}
      <Link href="https://interstitial.systems" className={linkClass}>
        Interstitial
      </Link>
      .
      {/* <div key="role">
      These days, I do this as a Design Engineer at{" "}
      <Link href="https://www.archetypeai.io/" className={linkClass}>
        Archetype
      </Link>
      . While continuing to grow my understanding of biology and the build
      environments through my personal practice at{" "}
      <Link href="https://interstitial.systems" className={linkClass}>
        Interstitial
      </Link>
      . */}
    </div>,
    <div key="previously">
      <span className="font-bold">Previously</span>, I&apos;ve worked at the
      intersection of design and development at{" "}
      <Link href="https://www.intel.com" className={linkClass}>
        Intel Labs
      </Link>
      ,{" "}
      <Link href="https://www.ideo.com/" className={linkClass}>
        IDEO
      </Link>
      ,{" "}
      <Link href="https://ideocolab.com/" className={linkClass}>
        CoLab
      </Link>
      ,{" "}
      <Link href="https://protocol.ai/" className={linkClass}>
        Protocol Labs
      </Link>
      ,{" "}
      <Link href="https://darkmatterlabs.org/" className={linkClass}>
        Dark Matter Labs
      </Link>
      ,{" "}
      <Link
        href="https://en.wikipedia.org/wiki/PARC_(company)"
        className={linkClass}
      >
        Xerox PARC
      </Link>
      , Fjord,{" "}
      <Link href="https://ezra.fi" className={linkClass}>
        Ezra
      </Link>
      ,{" "}
      <Link href="https://makezine.com/" className={linkClass}>
        Maker Media
      </Link>
      , and{" "}
      <Link href="https://ifttt.com/" className={linkClass}>
        IFTTT
      </Link>
      . Across these roles, I specialized in translating emerging technologies
      into working prototypes simplifying complexity to focus on core function.
      Along the way, I&apos;ve managed teams, led products from prototype to v0,
      and shipped work that brought new technologies to market.
    </div>,
    <div key="tinyfactories">
      Alongside this work, I cofounded{" "}
      <Link href="https://tinyfactories.space/" className={linkClass}>
        Tiny Factories
      </Link>
      , a tribe of makers supporting each other to establish creative footing
      where I deepened my practice through personal projects and climate-focused
      tinkering.
    </div>,
    <div key="academic">
      <span className="font-bold">My academic journey</span> began at{" "}
      <Link href="https://cca.edu/" className={linkClass}>
        California College of the Arts
      </Link>
      , where I studied{" "}
      <Link href="https://www.cca.edu/design/ixd/" className={linkClass}>
        Interaction Design
      </Link>
      . Around that time, I participated in John Bielenberg&apos;s experimental
      education program focused on{" "}
      <Link
        href="https://www.youtube.com/watch?v=PZJoJ-b2MIY"
        className={linkClass}
      >
        thinking wrong
      </Link>{" "}
      which shaped how I approach applying my capabilities to the world.
    </div>,
    <div key="site">
      <span className="font-bold">This site</span> is a public archive:{" "}
      <Link href="/journals" className={linkClass}>
        journals
      </Link>
      , and projects.
    </div>,
    <div key="connect">
      <span className="font-bold">If you want to connect</span>, let&apos;s grab{" "}
      <Link
        href="https://www.corner.inc/list/f98ae632-b6c6-41cb-b34f-5aab2d4cd15d"
        className={linkClass}
      >
        tea
      </Link>{" "}
      or go for a{" "}
      <Link
        href="https://www.alltrails.com/lists/running-with-friends-d9fc0cd?sh=rknycs"
        className={linkClass}
      >
        run
      </Link>
      .
    </div>,
  ];

  return <div className={bioProseGridClass}>{paragraphs}</div>;
};

export default Bio2026;
