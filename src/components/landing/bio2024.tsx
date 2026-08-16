import Link from "next/link";
import { bioLinkClassTight } from "@/components/landing/bio-shared";

const Bio2024 = () => (
  <div
    className="grid grid-col gap-4 text-left text-gray-800 dark:text-textDark"
    style={{ textAlign: "left" }}
  >
    <div>Hello, my name is Will. Welcome to my corner of the internet.</div>
    <div>
      <span className="font-bold">My focus</span> for the next decade, as a{" "}
      <Link href="https://www.are.na/block/27538602" className={bioLinkClassTight}>
        BioDesign Technologist
      </Link>
      , is to contribute to work that makes critical elements of natural systems
      visible. This focus on making the unseen seen looks at how we can change
      and see ourselves as a part of nature rather than adjacent to it.
    </div>
    <div>
      One way I&apos;m exploring this vision at scale is by reducing waste and
      creating demand for biomaterials at{" "}
      <Link href="https://blocks.flexhouse.dev/" className={bioLinkClassTight}>
        Flex
      </Link>
      .
    </div>
    <div>
      In parallel, to deepen my understanding of climate action and to develop
      new practices, I work on open software projects under the{" "}
      <Link href="https://iwg.earth" className={bioLinkClassTight}>
        Interstitial Working Group
      </Link>{" "}
      and tinker with personal projects at{" "}
      <Link href="https://tinyfactories.space/" className={bioLinkClassTight}>
        TinyFactories
      </Link>
      , a tribe of people supporting each other to establish their creative
      footing.
    </div>
    <div>
      <span className="font-bold">Previously</span>, I served as a design
      technologist at{" "}
      <Link href="https://www.intel.com" className={bioLinkClassTight}>
        Intel Labs
      </Link>
      ,{" "}
      <Link href="https://www.ideo.com/" className={bioLinkClassTight}>
        IDEO
      </Link>
      ,{" "}
      <Link href="https://ideocolab.com/" className={bioLinkClassTight}>
        CoLab
      </Link>
      ,{" "}
      <Link href="https://protocol.ai/" className={bioLinkClassTight}>
        Protocol Labs
      </Link>
      ,{" "}
      <Link href="https://darkmatterlabs.org/" className={bioLinkClassTight}>
        Dark Matter Labs
      </Link>
      , and{" "}
      <Link
        href="https://en.wikipedia.org/wiki/PARC_(company)"
        className={bioLinkClassTight}
      >
        Xerox PARC
      </Link>
      , where I specialized in translating emerging technologies into prototypes
      that simplified complex technologies to focus on their intended functions.
    </div>
    <div>
      <span className="font-bold">My academic journey</span> began at the{" "}
      <Link href="https://cca.edu/" className={bioLinkClassTight}>
        California College of the Arts
      </Link>
      , where I pursued a BFA in{" "}
      <Link href="https://www.cca.edu/design/ixd/" className={bioLinkClassTight}>
        Interaction Design
      </Link>
      . Around this time, I had the chance to participate in John
      Bielenberg&apos;s experimental education program. This program focused on{" "}
      <Link
        href="https://www.youtube.com/watch?v=PZJoJ-b2MIY"
        className={bioLinkClassTight}
      >
        thinking wrong
      </Link>
      , which largely shaped my thinking about how to apply my capabilities to
      the world.
    </div>
    <div>
      <span className="font-bold">This site</span> is to be a public archive
      divided into more formal{" "}
      <Link href="/notes" className={bioLinkClassTight}>
        notes
      </Link>
      , more rough thoughts in the form of{" "}
      <Link href="/logs" className={bioLinkClassTight}>
        logs
      </Link>
      , and an archive of{" "}
      <Link href="/projects" className={bioLinkClassTight}>
        projects
      </Link>
      .
    </div>
    <div>
      <span className="font-bold">If you want to connect</span>, let&#39;s grab
      a{" "}
      <Link
        href="https://www.corner.inc/list/f98ae632-b6c6-41cb-b34f-5aab2d4cd15d"
        className={bioLinkClassTight}
      >
        tea
      </Link>{" "}
      or go for a{" "}
      <Link
        href="https://www.alltrails.com/lists/running-with-friends-d9fc0cd?sh=rknycs"
        className={bioLinkClassTight}
      >
        run
      </Link>
      .
    </div>
  </div>
);

export default Bio2024;
