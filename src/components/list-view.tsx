"use client";
import Link from "next/link";
import Image from "next/image";

interface ListViewProps {
  data: any[];
}

export default function ListView({ data }: { data: any[] }) {
  const renderItem = (item: any, index: number) => {
    const itemType =
      typeof item.type === "string" && item.type.length > 0
        ? item.type.toLowerCase()
        : "project";
    const linkPath = `/${itemType}/${item.slug}`;

    // Print the linkPath for debugging
    console.log(`Rendering item with linkPath: ${linkPath}`);

    const contents: {
      [key: string]: { element: JSX.Element; colSpan: string };
    } = {
      newsletter: {
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
      log: {
        element: (
          <div className="border-2 border-gray-200 relative">
            <div>
              <div>{item.title}</div>
              <div className="absolute top-0 right-0 p-2">
                <span className="text-sm">
                  {item.publishedAt
                    ? new Date(item.publishedAt).getFullYear()
                    : "Unknown Date"}
                </span>
              </div>
            </div>{" "}
            <div>
              {item.metadata?.description || "No description available"}
            </div>
            <div className="flex flex-row border-t-2 border-gray-200 absolute bottom-0 left-0 w-full">
              <div className="flex flex-wrap gap-2 p-2">
                {item.tags?.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="bg-gray-200 rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="bg-gray-200 ml-auto">
                <Link href={linkPath}>→</Link>
              </div>
            </div>
            <div className="flex-1 p-4 pt-8"></div>
            {/* <div className="flex-1 p-4">
            {item.heroImage && (
              <Image
                src={item.heroImage}
                alt={item.title}
                layout="fill"
                className="rounded-lg"
              />
            )}
          </div> */}
          </div>
        ),
        colSpan: "col-span-12",
      },
      note: {
        element: (
          <div className="border-2 border-gray-200 relative">
            <div>
              <div>{item.title}</div>
              <div className="absolute top-0 right-0 p-2">
                <span className="text-sm">
                  {item.publishedAt
                    ? new Date(item.publishedAt).getFullYear()
                    : "Unknown Date"}
                </span>
              </div>
            </div>{" "}
            <div>
              {item.metadata?.description || "No description available"}
            </div>
            <div className="flex flex-row border-t-2 border-gray-200 absolute bottom-0 left-0 w-full">
              <div className="flex flex-wrap gap-2 p-2">
                {item.tags?.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="bg-gray-200 rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="bg-gray-200 ml-auto">
                <Link href={linkPath}>→</Link>
              </div>
            </div>
            <div className="flex-1 p-4 pt-8"></div>
            {/* <div className="flex-1 p-4">
            {item.heroImage && (
              <Image
                src={item.heroImage}
                alt={item.title}
                layout="fill"
                className="rounded-lg"
              />
            )}
          </div> */}
          </div>
        ),
        colSpan: "col-span-12",
      },
      photography: {
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
      project: {
        element: (
          <div className="border-2 border-gray-200 relative">
            <div>
              <div>{item.title}</div>
              <div className="absolute top-0 right-0 p-2">
                <span className="text-sm">
                  {item.publishedAt
                    ? new Date(item.publishedAt).getFullYear()
                    : "Unknown Date"}
                </span>
              </div>
            </div>{" "}
            <div>
              {item.metadata?.description || "No description available"}
            </div>
            <div className="flex flex-row border-t-2 border-gray-200 absolute bottom-0 left-0 w-full">
              <div className="flex flex-wrap gap-2 p-2">
                {item.tags?.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="bg-gray-200 rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="bg-gray-200 ml-auto">
                <Link href={linkPath}>→</Link>
              </div>
            </div>
            <div className="flex-1 p-4 pt-8"></div>
            {/* <div className="flex-1 p-4">
              {item.heroImage && (
                <Image
                  src={item.heroImage}
                  alt={item.title}
                  layout="fill"
                  className="rounded-lg"
                />
              )}
            </div> */}
          </div>
        ),
        colSpan: "col-span-12",
      },
      default: {
        element: (
          <div className="border-2 border-gray-200 relative">
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
          contents[itemType]?.colSpan || "col-span-6"
        }`}
      >
        {contents[itemType]?.element || (
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
