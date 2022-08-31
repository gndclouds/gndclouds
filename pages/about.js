import Link from "next/link";
import Image from "next/image";
import Layout from "../components/layout";
import Head from "next/head";
import { OG_NAME } from "../lib/constants";
import WilliamFelker from "../public/assets/williamfelker.JPG";

const cvData = [
  {
    company: "Anthropogenic",
    href: "https://anthropogenic.com",
    status: true,
    previewImage: "",
  },
  {
    company: "Tiny Factories",
    href: "https://tinyfactories.space",
    status: true,
    previewImage: "",
  },
  {
    company: "Oh Dot Zero",
    href: "https://ohdotzero.co",
    status: true,
    previewImage: "",
  },
  {
    company: "Dark Matter Labs",
    href: "https://darkmatterlabs.org/",
    status: false,
    previewImage: "",
  },
  {
    company: "Reduct Video",
    href: "https://reduct.video",
    status: false,
    previewImage: "",
  },
  {
    company: "Protocol Labs",
    href: "https://protocol.ai",
    status: false,
    previewImage: "",
  },
  {
    company: "Udacity",
    href: "https://www.udacity.com",
    status: false,
    previewImage: "",
  },
  {
    company: "Xero PARC",
    href: "https://www.parc.com",
    status: false,
    previewImage: "",
  },
  {
    company: "Fjord",
    href: "https://www.accenture.com",
    status: false,
    previewImage: "",
  },
  {
    company: "IFTTT",
    href: "https://ifttt.com",
    status: false,
    previewImage: "",
  },
  {
    company: "IDEO CoLab",
    href: "https://www.ideocolab.com",
    status: false,
    previewImage: "",
  },
  {
    company: "IDEO",
    href: "https://ideo.com",
    status: false,
    previewImage: "",
  },
  {
    company: "CCA Secret Project",
    href: "https://",
    status: false,
  },
  {
    company: "Maker Media",
    href: "https://make.co",
    status: false,
    previewImage: "",
  },
  {
    company: "Intel Labs",
    href: "",
    status: false,
    previewImage: "",
  },
  {
    company: "California College of the Arts",
    href: "https://www.cca.edu",
    status: false,
    previewImage: "",
  },
];

export default function About() {
  return (
    <>
      <Layout>
        <Head>
          <title>{OG_NAME}</title>
        </Head>
        <div className="flex flex-wrap">
          <div className="w-full sm:w-2/3">
            <div className="pb-9">Hey I’m Will,</div>
            <div className="pb-9">
              My day-to-day focuses are on implementing web3 technologies to
              help monitor greenhouse gas emissions. Currently, this takes the
              form of{" "}
              <Link href="https://hge.earth">
                <a>Earth API</a>
              </Link>
              , a data management and visualization tool for bioregions,
              built-in collaboration with{" "}
              <Link href="https://anthropogenic.com">
                <a>Anthropogenic</a>
              </Link>
              .
            </div>

            <div className="pb-9">
              I also{" "}
              <Link href="https://tinyfactories.space">
                <a>co-run a community</a>
              </Link>{" "}
              of creatives, consisting of indiepreneurs, coders, artists,
              designers, musicians, videographers, writers, animators (and more)
              who are working to support each other in establishing both
              creative autonomy and financial stability. This space allows me to
              tinker with smaller ideas to keep my creative thoughts flowing in
              a way that is not always sustainable at work.
            </div>

            <div className="pb-9">
              In the before times, I worked as a design technologist at research
              labs across all types of companies. In these roles, I translated
              emerging technologies into prototypes in which the core tech was
              abstracted away so that we could focus on the intended function.
              Before that was college at{" "}
              <Link href="https://cca.edu">
                <a>California College of the Arts</a>
              </Link>
              .
            </div>
          </div>
          <div className="w-full sm:w-1/3 relative rounded">
            <Image
              src={WilliamFelker}
              alt="william felker in 2022"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
        <div className=" uppercase ">Presently at:</div>
        {cvData.map((data, i) => (
          <>
            {data.status === true && (
              <Link key={i} href={data.href}>
                <a className="block pb-3">{data.company} ↗</a>
              </Link>
            )}
          </>
        ))}
        <div className="py-3"></div>
        <div className="pb-1 uppercase ">Previous at:</div>{" "}
        {cvData.map((data, i) => (
          <>
            {data.status === false && (
              <Link key={i} href={data.href}>
                <a className="block pb-3">{data.company} ↗</a>
              </Link>
            )}
          </>
        ))}
      </Layout>
    </>
  );
}
