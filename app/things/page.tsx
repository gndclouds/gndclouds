import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const news = [
  { company: {
    name: "That interview",
    href: "#"
  }},
  { company: {
    name: "Hour9",
    href: "#"
  }},
  { company: {
    name: "Learning The Right Way To Think Wrong",
    href: "http://creativeindustries.us/2017/12/12/learning-the-right-way-to-think-wrong/"
  }},
]

const awards = [
  { company: {
    name: "Impact Award",
    year: "#",
    href:"https://www.cca.edu/newsroom/2018-impact-award-winners/"
  }, domain:"design"},
  { company: {
    name: "Intel Comp",
    year: "#",
    href:"#"
  }, domain:"deign"},
]

const clients = [
  { company: {
    name: "ContiniouseTech",
    href: "#"
  }, jobTitle:"..."},
  { company: {
    name: "Amber Initiative",
    href: "https://amberinitiative.com"
  }, jobTitle:"..."},
  { company: {
    name: "Speechify",
    href: "#"
  }, jobTitle:"..."},
  { company: {
    name: "WorkshopCafe",
    href: "#"
  }, jobTitle:"..."},
  { company: {
    name: "Pando",
    href: "#"
  }, jobTitle:"..."},
]

const cv = [
  { company: {
    name: "Made For Earth",
    href: "https://madefor.earth"
  }, jobTitle:"Founder"},
  { company: {
    name: "tiny factories",
    href: "https://tinyfactories.space"
  }, jobTitle:"Co-Founder"},
  { company: {
    name: "Anthropogenic",
    href: "#"
  }, jobTitle:"Co-Founder"},
  { company: {
    name: "Dark Matter Labs",
    href: "https://darkmatterlabs.org"
  }, jobTitle:"Design Technologiest"},
  { company: {
    name: "Reduct Video",
    href: "https://reduct.video"
  }, jobTitle:"Software Developer"},
  { company: {
    name: "Protocol Labs",
    href: "https://protocol.ai"
  }, jobTitle:"Software Developer"},
  { company: {
    name: "Dubberly Design Office",
    href: "https://www.dubberly.com"
  }, jobTitle:"Designer"},
  { company: {
    name: "Udacity",
    href: "https://www.udacity.com"
  }, jobTitle:"UX Researcher"},
  { company: {
    name: "PARC",
    href: "https://www.xerox.com/en-us/innovation/parc"
  }, jobTitle:"Research Assistant"},
  { company: {
    name: "IDEO CoLab",
    href: "https://www.ideocolab.com"
  }, jobTitle:"Fellow"},
  { company: {
    name: "Fjord",
    href: "https://www.accenture.com/"
  }, jobTitle:"Technologiest / Designer"},
  { company: {
    name: "IFTTT",
    href: "https://ifttt.com/explore"
  }, jobTitle:"Designer"},
  { company: {
    name: "IDEO CoLab",
    href: "https://www.ideocolab.com"
  }, jobTitle:"Interaction Designer"},
  { company: {
    name: "California College of the Arts",
    href: "https://cca.edu"
  }, jobTitle:"TA, Coach, Residency"},
  { company: {
    name: "IDEO",
    href: "https://ideo.com"
  }, jobTitle:"IxD Intern"},
  { company: {
    name: "Maker Media",
    href: "https://make.co"
  }, jobTitle:"Design Technologiest"},
  { company: {
    name: "Intel Labs",
    href: "https://www.intel.com/content/www/us/en/research/overview.html"
  }, jobTitle:"Researcher & Prototyper"},
];

export default function Home() {
  return (
    <main className="">
      <div className="">Things</div>
      <div className="pb-3">
        Dolor sint cupidatat sunt mollit officia reprehenderit sit minim sint
        consectetur sint cillum minim nostrud duis. Culpa sunt esse eu occaecat
        nulla incididunt amet reprehenderit tempor esse sunt nisi. Sint mollit
        laborum exercitation ullamco laborum sint proident ea minim aute sint.
        Sit cupidatat nisi id excepteur tempor veniam minim nisi ullamco eiusmod
        enim magna Lorem occaecat.
      </div>

      <div className="py-9">
        <div className="">collections</div>
      </div>
      <div className="py-9">
        <div className="">projects</div>
      </div>
      <div className="py-9">
        <div className="">Teams</div>
        <div className="pb-3">
          Dolor sint cupidatat sunt mollit officia reprehenderit sit minim sint
          consectetur.
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {cv.map((d, i) => (
          <div>
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
          <div>
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
