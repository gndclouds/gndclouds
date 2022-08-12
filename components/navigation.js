import Link from "next/link";
import { useRouter } from "next/router";
const navigation = {
  main: [
    { name: "about", href: "/about" },
    { name: "thoughts", href: "/thoughts" },
    { name: "things", href: "/things" },
  ],
};

export default function Navigation() {
  const { asPath, pathname } = useRouter();
  return (
    <>
      <nav className="invisible md:visible sticky top-0 z-50 flex p-8 bg-backgroundlight dark:bg-backgrounddark text-textlight dark:text-textdark">
        <Link href="/">
          <a className="flex-none">gndclouds</a>
        </Link>
        <input
          className="grow pl-1 bg-backgroundlight dark:bg-backgrounddark text-textlight dark:text-textdark"
          id="myInput"
          placeholder={asPath}
        />
        <div className="right">
          {navigation.main.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className="inline-block pl-5 ">{item.name}</a>
            </Link>
          ))}
        </div>
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
