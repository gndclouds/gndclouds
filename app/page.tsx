import Link from "next/link";

const localLinks = [
  {
    Link: {
      name: "Logs",
      href: "/log",
    },
  },
  {
    Link: {
      name: "Newsletters",
      href: "/newsletter",
    },
  },
  {
    Link: {
      name: "Notes",
      href: "/note",
    },
  },
  {
    Link: {
      name: "Projects",
      href: "/project",
    },
  },
  {
    Link: {
      name: "Teams",
      href: "/teams",
    },
  },
];

const internetLinks = [
  {
    Link: {
      name: "are.na",
      href: "https://are.na/gndclouds",
    },
  },
  {
    Link: {
      name: "corner",
      href: "https://www.corner.inc/gndclouds",
    },
  },
  {
    Link: {
      name: "github",
      href: "https://github.com/gndclouds",
    },
  },
  {
    Link: {
      name: "read.cv",
      href: "https://read.cv/gndclouds",
    },
  },
  {
    Link: {
      name: "tiny garden",
      href: "https://tiny.garden/gndclouds",
    },
  },
  {
    Link: {
      name: "twitter",
      href: "https://twitter.com/gndclouds",
    },
  },
  {
    Link: {
      name: "webring",
      href: "https://webring.xxiivv.com/#random",
    },
  },
];

export default async function Page() {
  return (
    <div>
      <div className="flex flex-col md:flex-row h-screen w-full">
        {/* Left Static Column */}
        <div className="p-8 flex flex-col justify-between w-full md:w-1/2">
          <div className="">gndclouds</div>
          <div className="text-small sm:text-standard lg:text-large my-8 md:my-0">
            My focus for the next decade is contributing to work that helps make
            the unseen seen so that we can see ourselves as a part of nature
            instead of acting like we are adjacent to it.
          </div>
          {/* You can add more content here */}
        </div>
        {/* Right Scrollable Column */}
        <div className="p-8 flex flex-col justify-between w-full md:w-1/2 text-small sm:text-standard bg-[#f0f0f0]">
          <div className="flex-1 rounded-2xl bg-[#f9d73b] p-8 mb-4">
            <div className="text-standard border-b-4 border-[#f0f0f0]">
              More things:
            </div>
            {localLinks.map((d, i) => (
              <Link key={i} href={d.Link.href}>
                <div className="group hover:translate-x-1 duration-100">
                  {d.Link.name}{" "}
                  <span className="opacity-0 group-hover:opacity-100">→</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex-1 rounded-2xl bg-[#f9d73b] p-8 mt-4">
            <div className="text-standard border-b-4 border-[#f0f0f0]">
              follow along:
            </div>
            {internetLinks.map((d, i) => (
              <Link key={i} href={d.Link.href}>
                <div className="group text-small hover:translate-x-1 duration-100">
                  {d.Link.name}{" "}
                  <span className="opacity-0 group-hover:opacity-100">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
