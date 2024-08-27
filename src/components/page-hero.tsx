import Image from "next/image";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface PageHeroProps {
  data: {
    publishedAt: string;
    title: string;
    tags: string;
  };
}

const PageHero = ({ data }: PageHeroProps) => {
  const publishedAt =
    data.publishedAt && typeof data.publishedAt === "string"
      ? parseISO(data.publishedAt)
      : null;

  if (!publishedAt) {
    console.error("Invalid publishedAt value:", data.publishedAt);
  } else {
    console.log("Published At:", publishedAt);
  }

  return (
    <div className="min-w-screen flex">
      {/* Hero Section */}
      <div className="relative flex-1 h-[200px] overflow-hidden">
        {/* <Image
          src={image}
          alt="Hero Image"
          fill
          style={{ objectFit: "cover" }}
        /> */}

        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute top-0 left-0 p-4">
          <div className="text-white uppercase font-bold flex items-center">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeftIcon className="font-bold" /> gndclouds
            </Link>
            <span className="px-1">/</span>
            <Link href="/" className="inline">
              perivous log find
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 p-4 w-full">
          <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
            <div className="flex justify-start items-center">{data.title}</div>
            <div className="flex justify-end items-center ml-auto">
              Date:{" "}
              {publishedAt ? (
                <time dateTime={data.publishedAt}>
                  v.{format(publishedAt, "yyyy-MM")}
                </time>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHero;
