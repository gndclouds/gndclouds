import Link from "next/link";

const news = [
  {
    company: {
      name: "That interview",
      href: "#",
    },
  },
  {
    company: {
      name: "House9",
      href: "#",
    },
  },
  {
    company: {
      name: "Learning The Right Way To Think Wrong",
      href: "http://creativeindustries.us/2017/12/12/learning-the-right-way-to-think-wrong/",
    },
  },
];

const awards = [
  {
    company: {
      name: "Impact Award",
      year: "#",
      href: "https://www.cca.edu/newsroom/2018-impact-award-winners/",
    },
    domain: "design",
  },
  {
    company: {
      name: "Intel Comp",
      year: "#",
      href: "#",
    },
    domain: "deign",
  },
];

const clients = [
  {
    company: {
      name: "Amber Initiative",
      href: "https://amberinitiative.com",
    },
    jobTitle: "...",
  },
  {
    company: {
      name: "Speechify",
      href: "https://speechify.com/",
    },
    jobTitle: "...",
  },
  {
    company: {
      name: "WorkshopCafe",
      href: "https://www.workshopcafe.com/",
    },
    jobTitle: "...",
  },
  {
    company: {
      name: "Pando Populus",
      href: "https://pandopopulus.com/",
    },
    jobTitle: "...",
  },
];

const cv = [
  {
    company: {
      name: "🞴🞴🞴🞴 🞴🞴🞴🞴🞴",
      href: "/",
    },
    jobTitle: "Co-Founder",
  },
  {
    company: {
      name: "Made For Earth",
      href: "https://madefor.earth",
    },
    jobTitle: "Founder",
  },
  {
    company: {
      name: "tiny factories",
      href: "https://tinyfactories.space",
    },
    jobTitle: "Co-Founder",
  },
  {
    company: {
      name: "Anthropogenic",
      href: "https://anthropogenic.com",
    },
    jobTitle: "Co-Founder",
  },
  {
    company: {
      name: "Dark Matter Labs",
      href: "https://darkmatterlabs.org",
    },
    jobTitle: "Design Technologiest",
  },
  {
    company: {
      name: "Reduct Video",
      href: "https://reduct.video",
    },
    jobTitle: "Software Developer",
  },
  {
    company: {
      name: "Protocol Labs",
      href: "https://protocol.ai",
    },
    jobTitle: "Software Developer",
  },
  {
    company: {
      name: "Speechify",
      href: "https://speechify.com",
    },
    jobTitle: "Researcher",
  },
  {
    company: {
      name: "Dubberly Design Office",
      href: "https://www.dubberly.com",
    },
    jobTitle: "Designer",
  },
  {
    company: {
      name: "Udacity",
      href: "https://www.udacity.com",
    },
    jobTitle: "UX Researcher",
  },
  {
    company: {
      name: "Xerox PARC",
      href: "https://www.xerox.com/en-us/innovation/parc",
    },
    jobTitle: "Research Assistant",
  },
  {
    company: {
      name: "IDEO CoLab",
      href: "https://www.ideocolab.com",
    },
    jobTitle: "Fellow",
  },
  {
    company: {
      name: "Fjord",
      href: "https://www.accenture.com/",
    },
    jobTitle: "Technologiest / Designer",
  },
  {
    company: {
      name: "IFTTT",
      href: "https://ifttt.com/explore",
    },
    jobTitle: "Designer",
  },
  {
    company: {
      name: "IDEO CoLab",
      href: "https://www.ideocolab.com",
    },
    jobTitle: "Interaction Designer",
  },
  {
    company: {
      name: "California College of the Arts",
      href: "https://cca.edu",
    },
    jobTitle: "TA, Coach, Residency",
  },
  {
    company: {
      name: "IDEO",
      href: "https://ideo.com",
    },
    jobTitle: "IxD Intern",
  },
  {
    company: {
      name: "Maker Media",
      href: "https://make.co",
    },
    jobTitle: "Design Technologiest",
  },
  {
    company: {
      name: "Intel Labs",
      href: "https://www.intel.com/content/www/us/en/research/overview.html",
    },
    jobTitle: "Researcher & Prototyper",
  },
];

const projects = [
  {
    name: "🚧 Stories",
    description:
      "Madlib style story generator to normalize potential positive outcomes of our current climate future.",
    date: "2023",
    tags: "",
    image: { href: "", alt: "" },
    href: "https://stories.madefor.earth",
  },
  {
    name: "Earth API v2",
    description:
      "A standardized protocol and centralized repository for all Earth science data, enabling seamless search across university, government, and citizen science datasets.",
    date: "2023",
    tags: "",
    image: { href: "", alt: "" },
    href: "https://data.madefor.earth",
  },
  {
    name: "🚧 haiku",
    description:
      "A poem generator which makes a haiku based on how your city will be inpacted by the changing climate.",
    date: "2023",
    tags: "",
    image: { href: "", alt: "" },
    href: "https://haiku.madefor.earth",
  },
  {
    name: "Glossary",
    description:
      "A shared source of truth to build a better future. As awareness of the climate crisis increases, so does the noise and origin of information. We are working to make a glossary of terms, agreements, companies, organizations and more.",
    date: "2023",
    tags: "",
    image: { href: "", alt: "" },
    href: "https://glossary.madefor.earth",
  },
  {
    name: "Earth's API v1",
    description:
      "Everything humans do affects our ecosystems. And with many of the Earth's systems at tipping points, there must be accessibility and modernization of climate data platforms. Enter Earth API.",
    date: "2022",
    tags: "",
    image: { href: "", alt: "" },
    href: "https://hge.earth",
  },
  {
    name: "Tiny Garden",
    description:
      "a long term project to make a micro blogging platform to curate better communities around supporting indie makers, as they become entrepreneurs.",
    date: "2020",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://tiny.garden",
  },
  {
    name: "Circulaw",
    description:
      "A knowledge platform dedicated to enabling the transition to a circular economy by identifying opportunities in current law to support a circular future.",
    date: "2021-2022",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://www.circulaw.nl/",
  },
  {
    name: "Slate",
    description:
      "Slate is a search tool designed to help you remember and keep track of things you care about on the web.",
    date: "2020",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://slate.host",
  },
  {
    name: "Composing Sink",
    description: "ContiniouseTech",
    date: "2019",
    tags: "",
    image: { href: "", alt: "" },
    href: "#",
  },
  {
    name: "Pico Utility",
    description:
      "a case study, focusing on scaling a micro grid down to the size of one home through integrating the waste products of one utility system into another.",
    date: "2019",
    tags: "",
    image: { href: "", alt: "" },
    href: "#",
  },
  {
    name: "Okohaus",
    description:
      "an experimental community focused on sharing novel ideas around climate",
    date: "2018",
    tags: "",
    image: { href: "", alt: "" },
    href: "https://okohaus.earth/",
  },
  {
    name: "arena2slides",
    description: "Convert your are.na channel into a slideshow to share!",
    date: "2019",
    tags: "",
    image: { href: "", alt: "" },
    href: "http://arena2slides.herokuapp.com/",
  },
  {
    name: "😴 easy chinese",
    description:
      "A carefully curated, fun, and pretty flashcards to accelerate your chinese learning from scratch.",
    date: "2019",
    tags: "",
    image: { href: "", alt: "" },
    href: "/",
  },

  {
    name: "😴 Whole Person Care Field Guide",
    description:
      "We created a field guide for the new role which summarized our research and best practices for enrolling housing-insure people in Medi-Cal.",
    date: "2018",
    tags: "",
    image: { href: "", alt: "" },
    href: "/",
  },
  {
    name: "😴 IFTTT Maker Platform",
    description:
      "I ran the user research phase to determine the viability for a new product called Maker Platform. Established and managed the first community of makers who used IFTTT.",
    date: "2017",
    tags: "",
    image: { href: "", alt: "" },
    href: "https://ifttt.com/services/gctest/general",
  },
  {
    name: "😴 Secret Project Taiwan",
    description: "",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "#",
  },
  {
    name: "😴 Nomad",
    description:
      "At IDEO CoLab, I worked on Nomad. A platform which uses IPFS to create a peer-to-peer network of nodes that routes messages from publisher to subscriber.",
    date: "2016",
    tags: "",
    image: { href: "", alt: "" },
    href: "#",
  },

  {
    name: "😴 Galileo Starter Kit",
    description:
      "At Intel Labs I worked on the User Experience Research Group's Open Design Team where I focused on researching how Intel could make hardware more approachable to novice makers.",
    date: "2014",
    tags: "",
    image: { href: "", alt: "" },
    href: "#",
  },
];

async function getData() {
  const res = await fetch("https://api.are.na/v2/channels/c-bbhhcczsrto", {
    next: { revalidate: 3600 },
  });
  console.log(res);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page(props: any) {
  const collectionsData = await getData();

  return (
    <main className="">
      {/* Collection Hero */}
      <div className="uppercase text-h1 font-bold">Things:</div>
      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-2 text-h3">
          Most of what I work on today is focused on exploring new ways to see
          ourselves in nature instead of adjacent to it. This happens through
          collaboration, fantastic teams, and a mix of serious and silly
          projects.
        </div>

        {/* <div className="col-span-2">
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-red-300 p-4">
              <div className="uppercase ">Collections</div>
              <div className="font-bold">
                {collectionsData.length || "Unknown Length"}
              </div>
            </div>
            <div className="bg-red-300 p-4">
              <div className="uppercase">Projects</div>
              <div className="font-bold">
                {projects.length || "Unknown Length"}
              </div>
            </div>

            <div className="bg-red-300 p-4">
              <div className="uppercase">Teams</div>
              <div className="font-bold"> {cv.length || "Unknown Length"}</div>
            </div>
          </div>
        </div>*/}
      </div>
      {/* Anchor Links */}
      {/*<div className="grid grid-cols-3 gap-8">
        <div className="pt-3 border-t-2 border-black">
          <Link href="#section-measurements">
            <div className="hover:underline">Collections →</div>
          </Link>
        </div>
        <div className="pt-3 border-t-2 border-black">
          <Link href="#section-api">
            <div className="hover:underline">Projects →</div>
          </Link>
        </div>

        <div className="pt-3 border-t-2 border-black">
          <Link href="#section-changelog">
            <div className="hover:underline">Teams →</div>
          </Link>
        </div>
      </div>*/}

      {/*Collections Section*/}
      <div className="py-16">
        <div className="font-bold uppercase text-h3 border-t-4">
          Collections
        </div>
        <div className="pt-3 pb-9">
          Many of my projects begin as a curated collection of thoughts within
          an are.na channel. Below, you&apos;ll find the latest updates from
          these channels, each representing a potential project in the making.
          These evolving channels are the seeds from which innovative projects
          are likely to blossom in the near future.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionsData.contents.map((d: any) => (
            <Link
              key={d.id}
              className="w-full flex flex-col border-2 rounded p-4"
              href={`https://www.are.na/gndclouds/${d.slug}`}
            >
              <div className="font-bold">
                {d.title} <span className="font-serif">↗</span>
              </div>
              <div className="text-p">{d.metadata.description}</div>
            </Link>
          ))}
        </div>
      </div>
      {/*Projects Section*/}
      <div className="py-16">
        <div className="font-bold uppercase text-h3 border-t-4">projects</div>
        <div className="pb-3">
          I&apos;m working on expanding this section with more of my past work,
          but for now here are some selected projects
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((d, i) => (
            <div key={i} className="w-full flex flex-col rounded p-4">
              <Link href={d.href}>
                <div className="font-bold">{d.name} ↗</div>
              </Link>
              <div>{d.description}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-9">
        <div id="teams" className="font-bold uppercase text-h3 border-t-4">
          Teams
        </div>
        <div className="pb-3">
          Thank you to the mentors, collaborators, and friends who have played a
          vital role in my learning journey through shared experiences. These
          interactions have contributed to my personal growth and the refinement
          of my practice.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cv.map((d, i) => (
            <div key={i}>
              <div className="font-bold">{d.company.name}</div>
              <div>{d.jobTitle}</div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="py-9">
        <div className="">Collobrations</div>
        <div className="pb-3">
          Dolor sint cupidatat sunt mollit officia reprehenderit sit minim sint
          consectetur.
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {clients.map((d, i) => (
          <div  key={i}>
            <Link href={d.company.href}>
              <div className="font-bold">{d.company.name} ↗</div>
            </Link>
            <div>{d.jobTitle}</div>
          </div>
          ))}
          </div>
        </div> */}
    </main>
  );
}

// export async function getStaticProps() {
//   const response = await fetch(
//     `https://api.are.na/v2/channels/collections-els75g-cc08`,
//     {
//       next: { revalidate: 10 },
//     }
//   );
//   const revalidatedData = await response.json();
//   console.log(revalidatedData);
//   return {
//     props: {
//       revalidatedData,
//     },
//   };
// }
