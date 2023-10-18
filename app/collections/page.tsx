import Link from "next/link";
import Image from "next/image";

async function getData() {
  const res = await fetch(
    `https://api.are.na/v2/channels/collections-els75g-cc08`,
    {
      next: { revalidate: 10 },
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function CollectionsPage({}) {
  const revalidatedData = await getData();

  return (
    <div className=" dark:prose-invert">
      <div className="min-w-screen flex">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px] overflow-hidden">
          {/* <Image
            src="/hero-notes.png"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          /> */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white uppercase font-bold">
              <Link href="/" className=""></Link>
              <Link href="/" className="font-bol">
                ← gndclouds
              </Link>
              <span className="px-1">/</span>
              <Link href="/collections" className="">
                collections
              </Link>
            </div>

            <div className="text-white font-bold text-largest uppercase"></div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
              <div className="flex justify-start items-center">
                <Link href="https://are.na/gndclouds">
                  <div>
                    are.na <span className="font-mono">↗</span>
                  </div>
                </Link>
              </div>
              <div className="flex justify-center items-center"> </div>
              <div className="flex justify-end items-center"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Notes Section */}

      <div className="p-4 min-w-screen ">
        <div className="py-9 grid grid-cols-2 gap-4">
          {revalidatedData.contents.map((d: any) => (
            <Link
              key={d.id}
              className="flex flex-col space-y-1 mb-4"
              href={`https://www.are.na/made-for-earth/${d.slug}`}
            >
              <div className="w-full flex flex-col">
                <div className="col-span-2 uppercase font-bold text-h3">
                  {d.title} <span className="font-serif">↗</span>
                </div>
                <div className="col-span-2">{d.metadata.description}</div>
                {/* <div className="grid grid-cols-5">
            {d.map((d: any) => (
              <div className="">
              <div className="">Image</div>
              <div className="text-p">Text ↗</div>
              </div>
            ))}
            </div> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
