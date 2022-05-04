import Link from "next/link";
import Container from "./container";
import { EXAMPLE_PATH } from "../lib/constants";
import { useRouter } from "next/router";
const navigation = {
  main: [
    { name: "thoughts", href: "/thoughts" },
    { name: "things", href: "/things" },
  ],
};

export default function Navigation() {
  const { asPath, pathname } = useRouter();
  return (
    <>
      <nav className="invisible md:visible sticky top-0 z-50 flex px-5 py-2 bg-background text-textlight">
        <Link href="/">
          <a className="flex-none">gndclouds</a>
        </Link>
        <input
          className="grow bg-background"
          id="myInput"
          placeholder={asPath}
        />
        {/* <div className="right">
          {navigation.main.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className="inline-block pl-5 ">{item.name}</a>
            </Link>
          ))}
        </div> */}
      </nav>
      <nav
        className="visible md:invisible fixed bg-background text-green
       inset-x-0
       bottom-0
       p-4"
      >
        <Link href="/">
          <a className="flex-none">gndclouds</a>
        </Link>
      </nav>
    </>
  );
}
