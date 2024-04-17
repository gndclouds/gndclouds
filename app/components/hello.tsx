import Link from "next/link";

export default function Hello({ placeholder }: { placeholder: string }) {
  return (
    <div className="p-8 flex flex-col justify-between w-full">
      <div className="font-bold uppercase">gndclouds</div>
      <div className="text-small sm:text-standard lg:text-md my-8 md:my-0">
        <div>
          Hello, my name is{" "}
          <Link className="underline" href="/about" passHref>
            <>Will</>
          </Link>{" "}
          and welcome to my corner of the internet. Here, you will find an
          assortment of{" "}
          <button
            className={`px-4 py-2 border rounded 
              `}
          >
            notes
          </button>
          , <button className={`px-4 py-2 border rounded `}>logs</button>,{" "}
          <button className={`px-4 py-2 border rounded `}>newsletters</button>,
          and <button className={`px-4 py-2 border rounded`}>projects</button>{" "}
          that showcase my interests as a generalist. My primary focus is on
          learning how to best contribute to work that helps us to understand
          our place in nature rather than acting like we are adjacent to it. My
          next decades’ worth of work is centered on exploring to ….
        </div>
        <div className="">
          For now, this means reducing waste while increasing an individual’s
          creative agency at{" "}
          <Link href="#" passHref>
            <div className="underline">*********.</div>
          </Link>{" "}
          Creating new tooling to accelerate our understanding of climate action
          at the{" "}
          <Link href="https://planetary.software" passHref>
            <div className="underline">planetary software group</div>
          </Link>
          . And tinkering on personal projects at{" "}
          <Link href="https://tinyfactories.space" passHref>
            <div className="underline">TinyFactories</div>
          </Link>
          .
        </div>
      </div>

      {/* You can add more content here */}
    </div>
  );
}
