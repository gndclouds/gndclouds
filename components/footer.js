import Link from "next/link";
import Container from "./container";
import { EXAMPLE_PATH } from "../lib/constants";

const footerLinks = {
  main: [
    { name: "webring ↗", href: "https://webring.xxiivv.com/#random" },
    { name: "newsletter", href: "/newsletter" },
    { name: "blog", href: "/blog" },
    { name: "twitter ↗", href: "https://twitter.com/gndclouds" },
    { name: "arena ↗", href: "https://www.are.na/gndclouds" },
  ],
};

export default function Footer() {
  return (
    <>
      <footer className="bg-backgroundlight dark:bg-backgrounddark text-textlight dark:text-textdark invisible md:visible flex p-8 bg-background text-green">
        <div className="">
          {footerLinks.main.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className="inline-block pr-5">{item.name}</a>
            </Link>
          ))}
        </div>
      </footer>
      <footer className=" visible md:invisible"></footer>
    </>
  );
}
