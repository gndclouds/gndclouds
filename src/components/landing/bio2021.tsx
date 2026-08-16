import Link from "next/link";
import { bioLinkClass } from "@/components/landing/bio-shared";

const Bio2021 = () => (
  <div className="text-gray-800 dark:text-textDark">
    <div className="text-2xl font-bold"> Hi, I&apos;m Will.</div>
    <div className="mt-4">
      I currently focused on decarbonizing human system at{" "}
      <Link
        href="https://anthropogenic.com"
        className="underline underline-offset-4"
      >
        Anthopogenic
      </Link>
      , exploring decentralized governance at{" "}
      <Link
        href="https://darkmatterlabs.org/"
        className="underline underline-offset-4"
      >
        Dark Matter Labs
      </Link>{" "}
      co-running a community of{" "}
      <Link href="https://tinyfactories.space" className={bioLinkClass}>
        Tiny Factories
      </Link>
      .
    </div>
    <div className="mt-4">
      My past roles have been a mix of research, design, and front-end
      development at research labs within IDEO, PARC, Intel, Fjord, and Protocol
      Labs.
    </div>
  </div>
);

export default Bio2021;
