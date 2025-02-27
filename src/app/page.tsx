"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import Bio1997 from "../components/landing/bio1997";
import Bio2014 from "../components/landing/bio2014";
import Bio2016 from "../components/landing/bio2016";
import Bio2017 from "../components/landing/bio2017";
import Bio2019 from "../components/landing/bio2019";
import Bio2020 from "../components/landing/bio2020";
import Bio2021 from "../components/landing/bio2021";
import Bio2022 from "../components/landing/bio2022";
import Bio2023 from "../components/landing/bio2023";
import Bio2024 from "../components/landing/bio2024";
import Bio2025 from "../components/landing/bio2025";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowTopRightIcon, ArrowLeftIcon } from "@radix-ui/react-icons";

// Define types for CV and Press Awards data
interface CVEntry {
  title: string;
  start: string;
  end: string;
  description: string;
  role: string;
  company: string;
  location: string;
  collaborators?: string[];
}

interface PressAward {
  title: string;
  date: string;
  link: string;
}

export default function Home() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [cvData, setCvData] = useState<CVEntry[]>([]);
  const [pressAwards, setPressAwards] = useState<PressAward[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Fetch CV data
    fetch("/data/cv.json")
      .then((response) => response.json())
      .then((data) => setCvData(data))
      .catch((error) => console.error("Error loading CV data:", error));

    // Fetch Press Awards data
    fetch("/data/press-awards.json")
      .then((response) => response.json())
      .then((data) => setPressAwards(data))
      .catch((error) =>
        console.error("Error loading Press Awards data:", error)
      );
  }, []);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i
  )
    .filter((year) => year !== 2019)
    .concat([1997, 2014, 2016])
    .sort((a, b) => a - b);

  // Format date to display year only
  const formatDate = (dateString: string) => {
    if (dateString === "Present") return "Present";
    return new Date(dateString).getFullYear().toString();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      // Navigate to the entered path
      router.push(`/${inputValue.trim()}`);
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Left Static Column */}
      <div className="relative flex-1 overflow-hidden">
        <Image
          src={`/me/${selectedYear}_headshot.jpeg`}
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute top-0 left-0 p-4">
          <div className="text-white uppercase font-bold flex items-center">
            <Link href="/" className="inline-flex items-center">
              gndclouds
            </Link>
            <div
              className="inline-flex items-center ml-1 cursor-pointer"
              onMouseEnter={() => setShowInput(true)}
              onMouseLeave={() => !inputValue && setShowInput(false)}
            >
              <span className="text-white">/</span>
              {showInput && (
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type path..."
                  className="ml-1 bg-transparent border-b border-white text-white outline-none w-24 placeholder-gray-400"
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 p-4 w-full">
          {/* <div className="relative h-full w-1 bg-white">
            {years.map((year, index) => (
              <div
                key={index}
                className="absolute right-full mr-2 text-white cursor-pointer"
                style={{
                  top: `${((index + 1) * 100) / (years.length + 1)}%`,
                }}
                onClick={() => handleYearChange(year.toString())}
              >
                {year}
              </div>
            ))}
          </div> */}
          <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
            <div className="flex flex-col justify-start items-start">
              <Link href="https://are.na/gndclouds">
                <div className="block mb-2">
                  are.na <span className="font-mono">↗</span>
                </div>
              </Link>
              <Link href="https://bsky.app/profile/gndclouds.earth">
                <div className="block mb-2">
                  Bluesky <span className="font-mono">↗</span>
                </div>
              </Link>
            </div>
            <div className="flex justify-center items-center"></div>
          </div>
        </div>
      </div>
      {/* Right Scrollable Column */}
      <div className="p-8 w-full md:w-1/2 overflow-y-auto text-2xl">
        <div className="grid grid-col gap-4">
          {selectedYear === "1997" && <Bio1997 />}
          {selectedYear === "2014" && <Bio2014 />}
          {selectedYear === "2016" && <Bio2016 />}
          {selectedYear === "2017" && <Bio2017 />}
          {selectedYear === "2019" && <Bio2019 />}
          {selectedYear === "2020" && <Bio2020 />}
          {selectedYear === "2021" && <Bio2021 />}
          {selectedYear === "2022" && <Bio2022 />}
          {selectedYear === "2023" && <Bio2023 />}
          {selectedYear === "2024" && <Bio2024 />}
          {selectedYear === "2025" && <Bio2025 />}
        </div>
      </div>
    </div>
  );
}
