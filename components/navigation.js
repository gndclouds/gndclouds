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
    <>
      <nav className='invisible md:visible sticky top-0 z-50 flex bg-white px-5 py-2'>
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
      <nav
        className='visible md:invisible fixed
       inset-x-0
       bottom-0
       p-4'
      >
        <button
          type='button'
          className='inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          ↗
        </button>
        <Link href='/'>
          <a className='flex-none'>gndclouds</a>
        </Link>
      </nav>
    </>
  );
}
