import Link from "next/link";
import { bioLinkClassTight } from "@/components/landing/bio-shared";

const Bio2022 = () => (
  <div className="text-gray-800 dark:text-textDark">
    <div className="text-2xl font-bold">Hey Hi Hello </div>
    <div className="mt-4">
      Currently focused on decarbonizing human system at Anthopogenic, exploring
      decentralized governance at Dark Matter Labs co-running a community of
      Tiny Factories.
    </div>

    <div className="mt-4">
      My past roles have been a mix of research, design, and front-end
      development at research labs within IDEO, PARC, Intel, Fjord, and Protocol
      Labs.
    </div>
    <div className="mt-4">
      <div className="font-bold">Thoughts:</div>
      <ul>
        <li>Exploration around Solar Energy Capture</li>
        <li>Generative Design with Runwayml</li>
        <li>Ambient Landscapes of Taiwan</li>
      </ul>
    </div>
    <div className="mt-4">
      <div className="font-bold">Around the Internet:</div>

      <ul>
        <li>
          <Link href="https://arena.so" className={bioLinkClassTight}>
            arena ↗
          </Link>
        </li>
        <li>
          <Link href="https://arena.so" className={bioLinkClassTight}>
            newsletter ↗
          </Link>
        </li>
        <li>
          <Link href="https://arena.so" className={bioLinkClassTight}>
            twitter ↗
          </Link>
        </li>
        <li>webring ↗</li>
      </ul>
    </div>
  </div>
);

export default Bio2022;
