import Link from "next/link";
import { Suspense, useState } from "react";
import { motion, MotionConfig, useMotionValue } from "framer-motion";
import { Shapes } from "/lib/shapes";
import { transition } from "/lib/motion.config";
import useMeasure from "react-use-measure";
import { OG_NAME } from "../lib/constants";

const intros = [
  {
    blurb: "Decarbonizing humanity at",
    company: "Anthropogenic",
    href: "https://anthropogenic.com",
    color: "border-indigo-600 rounded border-2 px-4 py-4",
    font: "",
    current: true,
  },
  {
    blurb: "Exploring civic technology",
    company: "Dark Matter Labs",
    href: "https://darkmatterlabs.org",
    color: "border-indigo-600 rounded border-2 px-4 py-4",
    font: "",
    current: true,
  },
  {
    blurb: "Co-running a community of",
    company: "Tiny Factories",
    href: "https://tinyfactories.space",
    color: "border-indigo-600 rounded border-2 px-4 py-4",
    font: "",
    current: true,
  },
];

export default function Intro() {
  return (
    <>
      <div className='py-12 w-auto grid grid-cols-1 gap-x-9 gap-y-9 sm:grid-cols-3 content-center'>
        {intros.map((intro) => (
          <Link key={intro.name} href={intro.href}>
            <a className={intro.color}>
              <div className=''>{intro.blurb}</div>
              <div className=''>{intro.company}</div>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
}

export function HeroCard(props) {
  const [ref, bounds] = useMeasure({ scroll: false });
  const [isHover, setIsHover] = useState(false);
  const [isPress, setIsPress] = useState(false);

  return (
    <div className='grid grid-cols-1 gap-x-9 gap-y-9 sm:grid-cols-3 '></div>
  );
}
