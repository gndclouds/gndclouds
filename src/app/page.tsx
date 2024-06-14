import Link from "next/link";
import Image from "next/image";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
// import { categories } from "@/categories";
// import { Pagination } from "@/components/pagination";
// import { Posts } from "@/components/posts";
// import { getPaginatedPosts, postsPerPage } from "@/posts";

export default async function Home() {
  return (
    <div className="h-screen w-full flex">
      {/* Left Static Column */}
      <div className="relative flex-1  overflow-hidden">
        <Image
          src="/me/2023_headshot.JPG"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute bottom-0 p-4 w-full">
          <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
            <div className="flex justify-start items-center">
              <Link href="https://are.na/gndclouds">
                <div className="block">
                  are.na <span className="font-mono">↗</span>
                </div>
              </Link>
              <Link href="https://twitter.com/gndclouds">
                <div className="block pl-2">
                  x <span className="font-mono">↗</span>
                </div>
              </Link>
            </div>
            <div className="flex justify-center items-center"> </div>
            <div className="flex justify-end items-center"></div>
          </div>
        </div>
      </div>

      {/* Right Scrollable Column */}
      <div className="p-8 w-full md:w-1/2 overflow-y-auto text-2xl">
        <div className="grid grid-col gap-4">
          <div>
            Hello, my name is Will. Welcome to my corner of the internet.
          </div>
          <div>
            <span className="font-bold">My focus</span> for the next decade is
            to contribute to work that makes critical elements of natural
            systems visible. This focus on making the unseen seen looks at how
            we can change and see ourselves as a part of nature rather than
            adjacent to it.
          </div>
          <div>
            One way I&apos;m exploring this vision at scale is by reducing waste
            and creating demand for biomaterials at{" "}
            <Link
              href="https://www.are.na/block/27538602"
              className="underline"
            >
              🞲🞲🞲🞲 🞲🞲🞲🞲🞲
            </Link>
            .
          </div>
          <div>
            In parallel, to deepen my understanding of climate action and to
            develop new practices, I work on open software projects under the{" "}
            <Link href="https://iwg.earth" className="underline">
              Interstitial Working Group
            </Link>{" "}
            and tinker with personal projects at{" "}
            <Link href="https://tinyfactories.space/" className="underline">
              TinyFactories
            </Link>
            , a tribe of people supporting each other to establish their
            creative footing.
          </div>
          <div>
            <span className="font-bold">Previously</span>, I served as a design
            technologist at{" "}
            <Link href="https://www.ideo.com/" className="underline">
              IDEO
            </Link>{" "}
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
            , and{" "}
            <Link
              href="https://en.wikipedia.org/wiki/PARC_(company)"
              className="underline"
            >
              Xerox PARC
            </Link>
            , where I specialized in translating emerging technologies into
            prototypes that simplified complex technologies to focus on their
            intended functions.
          </div>
          <div>
            <span className="font-bold">My academic journey</span> began at the{" "}
            <Link href="https://cca.edu/" className="underline">
              California College of the Arts
            </Link>
            , where I pursued a BFA in{" "}
            <Link href="https://www.cca.edu/design/ixd/" className="underline">
              Interaction Design
            </Link>
            . Around this time, I had the chance to participate in John
            Bielenberg’s experimental education program. This program focused on{" "}
            <Link
              href="https://www.youtube.com/watch?v=PZJoJ-b2MIY"
              className="underline"
            >
              thinking wrong
            </Link>
            , which largely shaped my thinking about how to apply my
            capabilities to the world.
          </div>
          <div>
            <span className="font-bold">This site</span> is to be a public
            archive divided into more formal{" "}
            <Link href="/note" className="underline">
              notes
            </Link>
            , more rough thoughts in the form of{" "}
            <Link href="/logs" className="underline">
              logs
            </Link>
            , and an archive of{" "}
            <Link href="/projects" className="underline">
              projects
            </Link>
            .
          </div>
          <div>
            <span className="font-bold">If you want to connect</span>, let's
            grab a tea or go for a run.
          </div>
        </div>
      </div>
    </div>
  );
}
