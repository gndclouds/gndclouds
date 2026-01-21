import Link from "next/link";

const Bio2026 = () => (
  <div
    className="grid grid-cols-1 gap-4 text-left"
    style={{ textAlign: "left" }}
  >
    <div>Hello, my name is Will. Welcome to my corner of the internet.</div>
    <div>
      <span className="font-bold">My focus</span> for the next decade is
      contributing to work that makes critical elements of natural systems
      visible. This means changing how we see ourselves as part of nature rather
      than adjacent to it.
    </div>
    <div>
      I&apos;m exploring this vision at scale through{" "}
      <Link href="https://interstitial.systems" className="underline">
        Interstitial
      </Link>
      , building infrastructure that connects physical world sensor data to AI
      systems.
    </div>
    <div>
      <span className="font-bold">Previously</span>, I&apos;ve worked as a
      creative technologist, product designer,
      and design researcher at{" "}
      <Link href="https://www.intel.com" className="underline">
        Intel Labs
      </Link>
      ,{" "}
      <Link href="https://www.ideo.com/" className="underline">
        IDEO
      </Link>
      ,{" "}
      <Link href="https://ideocolab.com/" className="underline">
        CoLab
      </Link>
      ,{" "}
      <Link href="https://protocol.ai/" className="underline">
        Protocol Labs
      </Link>
      ,{" "}
      <Link href="https://darkmatterlabs.org/" className="underline">
        Dark Matter Labs
      </Link>
      ,{" "}
      <Link
        href="https://en.wikipedia.org/wiki/PARC_(company)"
        className="underline"
      >
        Xerox PARC
      </Link>
      , Fjord,{" "}
      <Link href="https://ezra.fi" className="underline">
        Ezra
      </Link>
      ,{" "}
      <Link href="https://makezine.com/" className="underline">
        Maker Media
      </Link>
      , and{" "}
      <Link href="https://ifttt.com/" className="underline">
        IFTTT
      </Link>
      . Across these roles, I specialized
      in translating emerging technologies into working prototypes—simplifying
      complexity to focus on core function. Along the way, I&apos;ve managed
      teams, led products from prototype to v0, and shipped work that brought
      new technologies to market.
    </div>
    <div>
      I also cofounded{" "}
      <Link href="https://tinyfactories.space/" className="underline">
        Tiny Factories
      </Link>
      , a tribe of makers supporting each other to establish creative footing
      where I deepened my practice through personal projects and climate-focused
      tinkering.
    </div>
    <div>
      <span className="font-bold">My academic journey</span> began at{" "}
      <Link href="https://cca.edu/" className="underline">
        California College of the Arts
      </Link>
      , where I studied{" "}
      <Link href="https://www.cca.edu/design/ixd/" className="underline">
        Interaction Design
      </Link>
      . Around that time, I participated in John Bielenberg&apos;s experimental
      education program focused on{" "}
      <Link
        href="https://www.youtube.com/watch?v=PZJoJ-b2MIY"
        className="underline"
      >
        thinking wrong
      </Link>{" "}
      which shaped how I approach applying my capabilities to the world.
    </div>
    <div>
      <span className="font-bold">This site</span> is a public archive of:{" "}
      <Link href="/logs" className="underline">
        logs
      </Link>
      ,{" "}
      <Link href="/journals" className="underline">
        journals
      </Link>
      , and projects.
    </div>
    <div>
      <span className="font-bold">If you want to connect</span>, let&apos;s grab{" "}
      <Link
        href="https://www.corner.inc/list/f98ae632-b6c6-41cb-b34f-5aab2d4cd15d"
        className="underline"
      >
        tea
      </Link>{" "}
      or go for a{" "}
      <Link
        href="https://www.alltrails.com/lists/running-with-friends-d9fc0cd?sh=rknycs"
        className="underline"
      >
        run
      </Link>
      .
    </div>
  </div>
);

export default Bio2026;
