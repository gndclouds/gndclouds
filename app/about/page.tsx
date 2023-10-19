import Link from "next/link";
import Image from "next/image";

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
    awards: {
      name: "Impact Award",
      year: "0000",
      href: "https://www.cca.edu/newsroom/2018-impact-award-winners/",
    },
    domain: "design",
  },
  {
    awards: {
      name: "Intel Comp",
      year: "0000",
      href: "#",
    },
    domain: "deign",
  },
];

const articles = [
  {
    article: {
      name: "Amber Initiative",
      href: "https://amberinitiative.com",
    },
  },
  {
    article: {
      name: "Amber Initiative",
      href: "https://amberinitiative.com",
    },
  },
  {
    article: {
      name: "Amber Initiative",
      href: "https://amberinitiative.com",
    },
  },
];

const teams = [
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

export default function AboutPage() {
  return (
    <div className="h-screen w-full flex">
      {/* Left Static Column */}
      <div className="relative flex-1  overflow-hidden">
        <Image
          src="/will/2023_headshot.JPG"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute top-0 left-0 p-4">
          <div className="text-white uppercase font-bold">
            <Link href="/" className=""></Link>
            <Link href="/" className="font-bol">
              ← gndclouds
            </Link>
            <span className="px-1">/</span>
            <Link href="/about" className="">
              about
            </Link>
          </div>

          <div className="text-white font-bold text-largest uppercase"></div>
        </div>
        <div className="absolute bottom-0 p-4 w-full">
          <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
            <div className="flex justify-start items-center">
              <Link href="https://are.na/gndclouds">
                <div>
                  are.na <span className="font-mono">↗</span>
                </div>
              </Link>
            </div>
            <div className="flex justify-center items-center"> </div>
            <div className="flex justify-end items-center"></div>
          </div>
        </div>
      </div>

      {/* Right Scrollable Column */}
      <div className="p-8 w-full md:w-1/2 overflow-y-auto">
        <div className="grid grid-cols-1 gap-8">
          {" "}
          <div className="grid grid-cols-1 gap-8">
            <div className="">Hey I’m Will,</div>
            <div className="">
              My day-to-day focus is making{" "}
              <Link
                className="underline underline-offset-2"
                href="https://madefor.earth"
              >
                things for the planet
              </Link>
              , sometimes as a designer and sometimes as a developer. My next
              big project focuses on{" "}
              <Link className="underline underline-offset-2" href="/">
                shifting our collective means of consumption
              </Link>{" "}
              into practices that allow humanity to become better planetary
              stewards. While periodically thinking about tea.
            </div>
            <div className="">
              Last Year, I co-founded{" "}
              <Link
                className="underline underline-offset-2"
                href="https://anthropogenic.com"
              >
                Anthropogenic ↗
              </Link>{" "}
              which <i>was</i> building a new system of accountability, through
              verification and monitoring, for financial institutions in
              preparation for pending regulations around emissions reporting.
            </div>
            <div className="">
              I{" "}
              <Link
                className="underline underline-offset-2"
                href="https://tinyfactories.space/"
              >
                co-run a community ↗
              </Link>{" "}
              ,called Tiny Factories, of creatives, consisting of indiepreneurs,
              coders, artists, designers, musicians, videographers, writers,
              animators (and more) who are working to support each other in
              establishing both creative autonomy and financial stability. This
              space allows me to tinker with smaller ideas to keep my creative
              thoughts flowing in a way that is not always sustainable at work.
            </div>
            <div className="">
              In the before times, I worked as a design technologist at research
              labs across all{" "}
              <Link
                className="underline underline-offset-2"
                href="/things#teams"
              >
                types of companies
              </Link>
              . In these roles, I translated emerging technologies into
              prototypes in which the core tech was abstracted away so that we
              could focus on the intended function.
            </div>
            <div className="">
              {" "}
              At the start I was at{" "}
              <Link
                className="underline underline-offset-2"
                href="https://cca.edu"
              >
                California College of the Arts ↗
              </Link>{" "}
              pursuing a BFA in{" "}
              <Link
                className="underline underline-offset-2"
                href="https://www.cca.edu/design/ixd/"
              >
                Interaction Design ↗
              </Link>
              .
            </div>
          </div>
          <div className="py-9"></div>
          {/* Section on Teams */}
          <div>
            <div className="uppercase border-t-2">Teams</div>
            <div>
              Thank you to the mentors, collaborators, and friends who have
              played a vital role in my learning journey through shared
              experiences. These interactions have contributed to my personal
              growth and the refinement of my practice.
            </div>
            <div className="grid grid-cols-1 gap-4">
              {teams.map((d, i) => (
                <div key={i}>
                  <div className="font-bold">{d.company.name}</div>
                  <div>{d.jobTitle}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Section on Articles */}
          <div>
            <div className="uppercase border-t-2">Articles</div>
            <div className="grid grid-cols-1 gap-4">
              {articles.map((d, i) => (
                <div key={i}>
                  <div className="font-bold">{d.article.name}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Section on Awards */}
          <div>
            <div className="uppercase border-t-2">Awards</div>
            <div className="grid grid-cols-1 gap-4">
              {awards.map((d, i) => (
                <div key={i}>
                  <div className="font-bold">{d.awards.name}</div>
                  <div>{d.awards.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
