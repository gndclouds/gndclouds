import Link from "next/link";
import { bioLinkClassTight } from "@/components/landing/bio-shared";

const Bio2020 = () => (
  <div className="text-gray-800 dark:text-textDark">
    I create projects as part of{" "}
    <Link href="https://tinyfactories.space" className={bioLinkClassTight}>
      Tiny Factories
    </Link>
    , while
    thinking about strategies for climate mitigation.
    <div className="mt-4">
      Recent explorations:
      <ul>
        <li>🌱 Growing a community of indiepreneurs at Tiny Factories </li>
        <li>⚒️ Building web 3.0 at Slate </li>
        <li>📚 Reading Waste is information and Ball Lighting</li>
      </ul>
    </div>
  </div>
);

export default Bio2020;
