import Link from "next/link";
import Container from "./container";
import { EXAMPLE_PATH } from "../lib/constants";
import { useRouter } from "next/router";
const navigation = {
  main: [
    { name: "thoughts", href: "thoughts" },
    { name: "things", href: "things" },
  ],
};

export default function Navigation() {
  const { asPath, pathname } = useRouter();
  return (
    <nav className='flex px-5 py-2'>
      <Link href='/'>
        <a className='flex-none'>gndclouds</a>
      </Link>
      <input className='grow' id='myInput' placeholder={asPath} />
      {navigation.main.map((item) => (
        <Link key={item.name} href={item.href}>
          <a className='inline-block pl-5'>{item.name}</a>
        </Link>
      ))}
    </nav>
  );
}
