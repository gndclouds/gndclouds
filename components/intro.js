import Link from "next/link";
import { CMS_NAME } from "../lib/constants";

export default function Intro() {
  return (
    <section className=' text-6xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8'>
      <section className=' inline-block'>
        Decarbonizing humanity at{" "}
        <Link href='https://anthropogenic.com'>
          <a className='font-serif underline text-green-600'>Anthropogenic</a>
        </Link>
      </section>
      <section className='inline-block'>
        Exploring civic technology{" "}
        <Link href='https://darkmatterlabs.org'>
          <a className='underline text-purple-500'>Dark Matter Labs</a>
        </Link>{" "}
      </section>
      <section className=' inline-block'>
        Co-running a community of{" "}
        <Link href='https://tinyfactories.space'>
          <a className='font-mono underline text-red-500'>Tiny Factories</a>
        </Link>
      </section>
      <>
        Born at 357ppm<sup>1</sup>
      </>
    </section>
  );
}
