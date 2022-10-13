import Link from "next/link";
import { useRouter } from "next/router";
const navigation = {
  main: [
    { name: "thoughts", href: "/thoughts" },
    { name: "about", href: "/about" },
    { name: "things", href: "/things" },
  ],
};

export default function Navigation() {
  const { asPath, pathname } = useRouter();
  return (
    <>
      <nav className="invisible md:visible sticky top-0 z-50 flex p-8 bg-backgroundlightmode text-textlightmode dark:bg-backgrounddarkmode dark:text-textdarkmode">
        <Link href="/">
          <a className="hover:underline hover:underline-offset-2 flex-none">
            gndclouds
          </a>
        </Link>
        <input
          className="grow pl-1 bg-backgroundlightmode text-textlightmode dark:bg-backgrounddarkmode dark:text-textdarkmode"
          id="myInput"
          placeholder={asPath}
        />
        {/* <div className="right">
          {navigation.main.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className="hover:underline hover:underline-offset-2 inline-block pl-5 ">
                {item.name}
              </a>
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
