"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [{ name: "about", href: "/about" }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="invisible md:visible sticky top-0 z-50 flex p-8 bg-backgroundlightmode text-textlightmode dark:bg-backgrounddarkmode dark:text-textdarkmode">
        <Link href="/">
          <div className="hover:underline hover:underline-offset-2 flex-none">
            gndclouds
          </div>
        </Link>
        <input
          className="grow pl-1 bg-backgroundlightmode text-textlightmode dark:bg-backgrounddarkmode dark:text-textdarkmode"
          id="myInput"
          placeholder="/"
        />
        <div className="right">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className="hover:underline hover:underline-offset-2 inline-block pl-5 ">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </nav>
      <nav
        className="grid col-span-4 gap-1 visible md:invisible fixed bg-backgroundlightmode text-green
       inset-x-0
       bottom-0
       p-4"
      >
        <Link href="/">
          <div>gndclouds</div>
        </Link>
        <Link href="/thoughts">
          <div>thoughts</div>
        </Link>
        <Link href="/things">
          <div>things</div>
        </Link>
        <Link href="/about">
          <div>about</div>
        </Link>
      </nav>
    </>
  );
}
