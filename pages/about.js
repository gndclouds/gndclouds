import Link from "next/link";
import Layout from "../components/layout";
import Head from "next/head";
import { OG_NAME } from "../lib/constants";

const cvData = [
  {
    title: "Cheif Design Offisor",
    company: "Anthropogenic",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "daily",
    company: "Tiny Factories",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "Design Technologist",
    company: "Dark Matter Labs",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "Software Engineer",
    company: "Reduct Video",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "Software Engineer",
    company: "Protocol Labs",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "UX Researcher",
    company: "Udacity",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "Member",
    company: "CCA Secret Project",
    start: "2015",
    end: "2018",
    url: "",
  },
  {
    title: "Creative Technologiest / Interaction Designer",
    company: "Fjord",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "Product Consultant",
    company: "IFTTT",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "Interaction Designer",
    company: "IDEO CoLab",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "C",
    company: "California College of the Arts",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "Interaction Design Intern",
    company: "IDEO",
    start: "",
    end: "",
    url: "",
  },
  {
    title: "Creative Technologist Intern",
    company: "Maker Media",
    start: "",
    end: "",
    url: "words",
  },
  {
    title: "UXR Hardware & Software Prototyper",
    company: "Intel Labs",
    start: "",
    end: "",
    url: "",
  },
];

export default function About() {
  // Create an image state
  // update when box is pressed

  return (
    <>
      <Layout>
        <Head>
          <title>{OG_NAME}</title>
        </Head>
        <p>hi,</p>
        <br />
        <p>this is will's corner of the 🌐.</p>
        <br />
        <p>
          he is currently building a monitoring and verification company for
          greenhouse gas emissions called{" "}
          <a href="https://anthropogenic.com">Anthropogenic</a>.
        </p>
        <br />
        <p>
          when not thinking, reading, or learning about the climate, he can be
          found climbing, hiking, forging, or building tiny electronics.
        </p>
        <br />

        <p>
          Preiviousely he worked as a design/developer in research groups at{" "}
          <a hfre="">Dark Matter Labs</a>, <a hfre="">Xero PARC</a>,{" "}
          <a hfre=""> Protocal Labs</a>, <a hfre="">IDEO</a>, <a>Intel</a>, and{" "}
          <a hfre="">Intel</a>
        </p>
      </Layout>
    </>
  );
}
