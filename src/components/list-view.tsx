"use client";
import Link from "next/link";
import Image from "next/image";

interface ListViewProps {
  data: any[];
}

export default function ListView({ data }: { data: any[] }) {
  const renderItem = (item: any, index: number) => {
    const linkPath = `/${item.type}/${item.slug}`;

    // Print the linkPath for debugging
    console.log(`Rendering item with linkPath: ${linkPath}`);

    const contents: {
      [key: string]: { element: JSX.Element; colSpan: string };
    } = {
      Newsletter: {
        element: (
          <div className="border-2 border-gray-200 rounded-lg relative">
            <div className="absolute top-0 left-0 p-2">
              <span className="bg-gray-200 text-gray-800 text-xs font-bold uppercase px-2 py-1 rounded-full">
                #newsletter
              </span>
            </div>
            <div className="absolute top-0 right-0 p-2">
              <span className="text-sm">
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex-1 p-4 pt-8">
              <h2 className="text-2xl">
                <Link href={linkPath}>{item.title}</Link>
              </h2>
            </div>
          </div>
        ),
        colSpan: "col-span-12",
      },
      Log: {
        element: (
          <div className="flex flex-col border-2 border-gray-200 rounded-lg relative">
            <div className="flex justify-between w-full p-2">
              <span className="text-xs uppercase px-2 py-1">
                logs / {item.slug}
              </span>
              <span className="text-sm">
                {item.publishedAt
                  ? new Date(item.publishedAt).toISOString().slice(0, 10)
                  : "Unknown Date"}
              </span>
            </div>
            <div className="flex flex-col w-full p-4">
              <h2 className="text-xl">
                <Link href={linkPath}>{item.title}</Link>
              </h2>
              <p>{item.snippet}</p>
            </div>
          </div>
        ),
        colSpan: "col-span-12",
      },
      Note: {
        element: (
          <div className="border-2 border-gray-200 rounded-lg relative">
            <div className="absolute top-0 left-0 p-2">
              <span className="bg-gray-200 text-gray-800 text-xs font-bold uppercase px-2 py-1 rounded-full">
                #note
              </span>
            </div>
            <div className="absolute top-0 right-0 p-2">
              <span className="text-sm ordinal slashed-zero tabular-numsyarn ">
                {item.publishedAt
                  ? new Date(item.publishedAt).toISOString().slice(0, 10)
                  : "Unknown Date"}
              </span>
            </div>
            <div className="flex-1 p-4 pt-8">
              <h2 className="text-2xl">
                <Link href={linkPath}>{item.title}</Link>
              </h2>
            </div>
          </div>
        ),
        colSpan: "col-span-12",
      },
      Photography: {
        element: (
          <div className="border-2 border-gray-200 rounded-lg relative">
            <div className="">
              {item.urls && (
                <Image
                  src={item.urls.regular}
                  alt={item.title}
                  width={100}
                  height={100}
                />
              )}
            </div>
            <div className="card-title">
              {/* <p>
                Camera: {item.exif.make} {item.exif.model}
              </p>
              <p>Exposure: {item.exif.exposure_time}s</p>
              <p>Aperture: f/{item.exif.aperture}</p>
              <p>Focal Length: {item.exif.focal_length}mm</p>
              <p>ISO: {item.exif.iso}</p> */}
            </div>
          </div>
        ),
        colSpan: "col-span-12",
      },
      Project: {
        element: (
          <div className="border-2 border-gray-200 rounded-lg relative">
            {/* <div className="absolute top-0 left-0 p-2">
              <span className="bg-gray-200 text-gray-800 text-xs font-bold uppercase px-2 py-1 rounded-full">
                #projects
              </span>
            </div> */}
            <div className="absolute top-0 right-0 p-2">
              <span className="text-sm">
                {item.publishedAt
                  ? new Date(item.publishedAt).getFullYear()
                  : "Unknown Date"}
              </span>
            </div>
            <div className="flex-1 p-4 pt-8">
              <h2 className="text-2xl">
                <Link href={linkPath}>{item.title}</Link>
              </h2>
              <p>{item.metadata.description}</p>
            </div>
            <div className="flex-1 p-4">
              {item.heroImage && (
                <Image
                  src={item.heroImage}
                  alt={item.title}
                  layout="fill"
                  className="rounded-lg"
                />
              )}
            </div>
          </div>
        ),
        colSpan: "col-span-12",
      },
      default: {
        element: (
          <div className="border-2 border-gray-200 rounded-lg relative">
            <div className="flex-1 p-4 pt-8">
              <h2 className="text-2xl">
                <Link href={linkPath}>{item.title} - default</Link>
              </h2>
            </div>
          </div>
        ),
        colSpan: "col-span-12",
      },
    };

    return (
      <div
        key={index}
        className={`col-span-12 md:${
          contents[item.type]?.colSpan || "col-span-6"
        }`}
      >
        {contents[item.type]?.element || (
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <h2 className="text-xl">
              <Link href={linkPath}>{item.title}</Link>
            </h2>
            <p>{item.snippet}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
}
