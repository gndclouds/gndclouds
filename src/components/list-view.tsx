"use client";
import Link from "next/link";
import Image from "next/image";

interface ListViewProps {
  data: any[];
}

export default function ListView({ data }: { data: any[] }) {
  const renderItem = (item: any, index: number) => {
    const linkPath = `/${item.type}/${item.slug}`;

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
          <div className="border-2 border-gray-200 rounded-lg relative">
            <h2 className="text-2xl">
              <Link href={linkPath}>{item.title}</Link>
            </h2>
            <p>Date: {item.publishedAt.toString()}</p>
            <p>{item.content}</p>
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
            <div className="absolute top-0 left-0 p-2">
              <span className="bg-gray-200 text-gray-800 text-xs font-bold uppercase px-2 py-1 rounded-full">
                #projects
              </span>
            </div>
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
              <p>{item.description}</p>
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

    const content = contents[item.type] || contents.default;

    return (
      <div key={item.id || index}>
        <Link href={`#${item.slug}`} id={item.slug}>
          <div className={`${content.colSpan} border-r-2 border-gray-300`}>
            {content.element}
          </div>
        </Link>
      </div>
    );
  };

  return <div>{data.map((item, index) => renderItem(item, index))}</div>;
}
