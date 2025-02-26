"use client";

import Image from "next/image";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

interface CollectionHeroProps {
  name: string;
  projects: any[]; // Specify more detailed type if possible
  allProjects: any[]; // Specify more detailed type if possible
}

const CollectionHero = ({
  name,
  projects,
  allProjects,
}: CollectionHeroProps) => {
  const [backgroundImage, setBackgroundImage] = useState("/background.jpg");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // This code only runs on the client side
    if (typeof window !== "undefined") {
      // Get current hour (0-23)
      const currentHour = new Date().getHours();
      const hourlyImagePath = `/backgrounds/hour-${currentHour}.jpg`;

      // Set the image path based on the current hour
      setBackgroundImage(hourlyImagePath);
      // Reset error state when trying a new image
      setImageError(false);
    }
  }, []);

  return (
    <div className="min-w-screen flex">
      {/* Hero Section */}
      <div className="relative flex-1 h-[200px] overflow-hidden">
        <Image
          src={imageError ? "/background.jpg" : backgroundImage}
          alt="Hero Image"
          fill
          style={{ objectFit: "cover", objectPosition: "bottom" }}
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute top-0 left-0 p-4">
          <div className="text-white uppercase font-bold flex items-center">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeftIcon className="font-bold" /> gndclouds
            </Link>
            <span className="px-1">/</span>
            <Link href="/projects" className="inline">
              {name}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 p-4 w-full">
          <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
            <div className="flex justify-start items-center">
              {/* <time dateTime={projects[0].publishedAt}>
                v.{format(parseISO(projects[0].publishedAt), "yyyy-MM")}
              </time> */}
            </div>
            <div className="flex justify-center items-center">
              {allProjects.length} Entries
            </div>
            <div className="flex justify-end items-center">
              <Link href="/api/projects/rss.xml">
                <div>RSS</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionHero;
