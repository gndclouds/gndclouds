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
            Hello, my name is Will. Welcome to my corner of the internet.{" "}
            <Link href="/feed" className="underline">
              Here
            </Link>
            , you’ll find various notes, logs, newsletters, and projects that
            showcase my broad range of interests.
          </div>
          <div>
            My focus for the next decade is to contribute to work that makes the
            unseen visible, allowing humanity to recognize itself as a part of
            nature rather than separate from it.
          </div>
          <div>
            Currently, this involves reducing waste and enhancing individual
            creative agency to construct structures at{" "}
            <Link
              href="https://www.are.na/block/27538602"
              className="underline"
            >
              🞲🞲🞲🞲 🞲🞲🞲🞲🞲
            </Link>
            .
          </div>
          <div>
            To deepen my understanding of climate action and to develop new
            practices, I work on open software projects under the{" "}
            <Link href="https://planetary.software" className="underline">
              Planetary Software Group
            </Link>{" "}
            and tinker with personal projects at{" "}
            <Link href="https://tinyfactories.space/" className="underline">
              TinyFactories
            </Link>
            , a hub for collaborative innovation.
          </div>
          <div>
            Previously, I served as a design technologist at{" "}
            <Link href="https://read.cv/gndclouds" className="underline">
              research labs across various types of companies
            </Link>
            , where I specialized in translating emerging technologies into
            prototypes that simplified complex technologies to focus on their
            intended functions.
          </div>
          <div>
            My academic journey began at the{" "}
            <Link href="https://cca.edu/" className="underline">
              California College of the Arts
            </Link>
            , where I pursued a BFA in{" "}
            <Link href="https://www.cca.edu/design/ixd/" className="underline">
              Interaction Design
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
