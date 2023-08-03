import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
      name: "ContiniouseTech",
      href: "https://continuoustech.com/",
    },
    jobTitle: "...",
  },
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
    name: "Data",
    description: "ContiniouseTech",
    date: "ContiniouseTech",
    tags: "ContiniouseTech",
    image: { href: "", alt: "" },
    href: "https://data.madefor.earth",
  },
  {
    name: "haiku",
    description:
      "A poem generator which makes a haiku based on how your city will be inpacted by the changing climate.",
    date: "ContiniouseTech",
    tags: "ContiniouseTech",
    image: { href: "", alt: "" },
    href: "https://haiku.madefor.earth",
  },
  {
    name: "Glossary",
    description:
      "A shared source of truth for terms, technology, treaties, and companines working on climate. ",
    date: "ContiniouseTech",
    tags: "ContiniouseTech",
    image: { href: "", alt: "" },
    href: "https://glossary.madefor.earth",
  },
  {
    name: "🪦 Earth's API",
    description:
      "Everything humans do affects our ecosystems. And with many of the Earth's systems at tipping points, there must be accessibility and modernization of climate data platforms. Enter Earth API.",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://hge.earth",
  },
  {
    name: "Tiny Garden",
    description: "ContiniouseTech",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://tiny.garden",
  },
  {
    name: "Circulaw",
    description:
      "CircuLaw is a knowledge platform dedicated to enabling the transition to a circular economy by identifying opportunities in current law to support a circular future.",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://www.circulaw.nl/",
  },
  {
    name: "Slate",
    description:
      "Slate is a search tool designed to help you remember and keep track of things you care about on the web.",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://slate.host",
  },
  {
    name: "Composing Sink",
    description: "ContiniouseTech",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "#",
  },
  {
    name: "Pico Utility",
    description: "ContiniouseTech",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "#",
  },
  {
    name: "🪦 Okohaus",
    description: "ContiniouseTech",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://okohaus.earth/",
  },
  {
    name: "arena2slides",
    description: "Convert your are.na channel into a slideshow to share!",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "http://arena2slides.herokuapp.com/",
  },
  {
    name: "🪦 easy chinese",
    description:
      "A carefully curated, fun, and pretty flashcards to accelerate your chinese learning from scratch.",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://easychinese.space/",
  },

  {
    name: "🪦 frienda",
    description: "Ever wanted to share a confidential secret? Now you can!",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "https://www.frienda.space/",
  },

  {
    name: "🪦 Galileo Starter Kit",
    description: "ContiniouseTech",
    date: "tbd",
    tags: "tbd",
    image: { href: "", alt: "" },
    href: "#",
  },
];

export default function Home() {
  return (
    <main className="">
      <div className="font-bold text-lg">Things</div>
      <div className="pb-3">
        Most of what I work on today is focused on exploring new ways to see
        ourselves in nature instead of adjacent to it. This happens through
        collaboration, fantastic teams, and a mix of serious and silly projects.
        Since my path to get here constantly evolves, I share more of my past
        work to show when some project ideas started vs. when they became a
        reality.{" "}
      </div>

      <div className="py-9">
        <div className="">collections</div>
        <div className="pb-3">
          Dolor sint cupidatat sunt mollit officia reprehenderit sit minim sint
          consectetur.
        </div>
      </div>
      <div className="py-9">
        <div className="">projects</div>
        <div className="pb-3">
          Dolor sint cupidatat sunt mollit officia reprehenderit sit minim sint
          consectetur.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((d, i) => (
            <div key={i}>
              <Link href={d.href}>
                <div className="font-bold">{d.name} ↗</div>
              </Link>
              <div>{d.description}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-9">
        <div id="teams">Teams</div>
        <div className="pb-3">
          Dolor sint cupidatat sunt mollit officia reprehenderit sit minim sint
          consectetur.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cv.map((d, i) => (
            <div key={i}>
              <Link href={d.company.href}>
                <div className="font-bold">{d.company.name} ↗</div>
              </Link>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

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
