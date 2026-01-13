"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CollectionHero from "@/components/collection-hero";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";

interface CVItem {
  title: string;
  start: string;
  end: string;
  description: string;
  company: string;
  location: string;
  type: "full-time" | "client";
  responsibilities: string[];
}

interface PressAwardItem {
  title: string;
  date: string;
  link: string;
  description: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  location: string;
  achievements: string[];
}

interface Proficiencies {
  [key: string]: string[];
}

const fetchCVData = async (): Promise<CVItem[]> => {
  const response = await fetch("/data/cv.json");
  if (!response.ok) {
    throw new Error("Failed to fetch CV data");
  }
  return response.json();
};

const fetchPressAwardsData = async (): Promise<PressAwardItem[]> => {
  const response = await fetch("/data/press-awards.json");
  if (!response.ok) {
    throw new Error("Failed to fetch press awards data");
  }
  return response.json();
};

const fetchEducationData = async (): Promise<EducationItem[]> => {
  const response = await fetch("/data/education.json");
  if (!response.ok) {
    throw new Error("Failed to fetch education data");
  }
  return response.json();
};

const fetchProficienciesData = async (): Promise<Proficiencies> => {
  const response = await fetch("/data/proficiencies.json");
  if (!response.ok) {
    throw new Error("Failed to fetch proficiencies data");
  }
  return response.json();
};

export default function CVPage() {
  const [cvData, setCVData] = useState<CVItem[]>([]);
  const [pressAwardsData, setPressAwardsData] = useState<PressAwardItem[]>([]);
  const [educationData, setEducationData] = useState<EducationItem[]>([]);
  const [proficienciesData, setProficienciesData] = useState<Proficiencies>({});
  const [error, setError] = useState<string | null>(null);

  // Separate publications from awards
  const publications = pressAwardsData.filter(
    (item) => item.title === "Nudging The Needle on the Orphenyade"
  );
  const awards = pressAwardsData.filter(
    (item) => item.title !== "Nudging The Needle on the Orphenyade"
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cv, pressAwards, education, proficiencies] = await Promise.all([
          fetchCVData(),
          fetchPressAwardsData(),
          fetchEducationData(),
          fetchProficienciesData(),
        ]);
        setCVData(cv);
        setPressAwardsData(pressAwards);
        setEducationData(education);
        setProficienciesData(proficiencies);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
    };

    loadData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  // Separate experience into recent and older items
  // Recent items: 2021+ or Present/Intermittent
  const recentExperience = cvData.filter(
    (item) =>
      (item.type === "full-time" || item.type === "client") &&
      (parseInt(item.start) >= 2021 || item.end === "Present" || item.end === "Intermittent")
  );

  // Older items: everything before 2021 (excluding Present/Intermittent)
  const olderItems = cvData.filter(
    (item) =>
      parseInt(item.start) < 2021 &&
      item.end !== "Present" &&
      item.end !== "Intermittent"
  );

  // Sort recent experience by start date (most recent first)
  const sortedRecentExperience = recentExperience.sort((a, b) => {
    // Sort by start year descending, with "Present" items first
    if (a.end === "Present" && b.end !== "Present") return -1;
    if (b.end === "Present" && a.end !== "Present") return 1;
    return parseInt(b.start) - parseInt(a.start);
  });

  // Sort older items by start date (most recent first)
  const sortedOlderItems = olderItems.sort((a, b) => {
    return parseInt(b.start) - parseInt(a.start);
  });

  // Format data for CollectionHero
  const allData: any[] = [];

  return (
    <main className="min-h-screen bg-white text-black print:bg-white">
      <div className="relative print:hidden">
        <CollectionHero
          name="CV"
          projects={allData}
          allProjects={allData}
          showEntriesCount={false}
          showRssLink={false}
        />
        
        {/* Print Link - positioned like RSS link */}
        <div className="absolute bottom-0 right-0 p-4 w-full pointer-events-none z-10">
          <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
            <div className="flex justify-start items-center"></div>
            <div className="flex justify-center items-center"></div>
            <div className="flex justify-end items-center pointer-events-auto">
              <button onClick={handlePrint} className="cursor-pointer hover:opacity-80">
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-baseline border-b border-black pb-2">
          <h1 className="text-4xl font-bold uppercase">WILLIAM FELKER</h1>
          <ObfuscatedEmail className="text-lg" />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column - Experience */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-6 mt-8">EXPERIENCE</h2>
            
            {/* Recent Experience Items */}
            {sortedRecentExperience.map((item, index) => (
              <div key={index} className="mb-6">
                <div className="text-lg flex justify-between items-baseline">
                  <span>
                    {item.company === "Freelancer" 
                      ? <><span className="font-bold">{item.company}</span>, <span className="font-normal">{item.title}</span></>
                      : <><span className="font-bold">{item.company}</span>, <span className="font-normal">{item.title}</span></>}
                  </span>
                  <span className="text-xs font-normal">{item.start} - {item.end}</span>
                </div>
                <div className="text-sm leading-relaxed mt-2">{item.description}</div>
              </div>
            ))}

            {/* Earlier Endeavors Section - All older items grouped together */}
            {sortedOlderItems.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold uppercase mb-4">Earlier Endeavors</h3>
                <div className="text-sm mb-2">
                  {Math.min(...sortedOlderItems.map(item => parseInt(item.start)))} - {Math.max(...sortedOlderItems.map(item => parseInt(item.end) || parseInt(item.start)))}
                </div>
                <ul className="space-y-2 text-sm">
                  {sortedOlderItems.map((item, index) => (
                    <li key={index}>
                      <span className="font-bold">{item.company}</span>, <span className="font-normal">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Proficiencies, Education, Publications, Awards */}
          <div>
            {/* Proficiencies Section */}
            <h2 className="text-xl font-bold uppercase mb-4 mt-8">PROFICIENCIES</h2>
            {Object.entries(proficienciesData).map(([category, skills]) => (
              <div key={category} className="mb-6">
                <h3 className="font-bold text-sm mb-2">{category}</h3>
                <div className="text-sm">
                  {skills.join(" · ")}
                </div>
              </div>
            ))}

            {/* Education Section */}
            <h2 className="text-xl font-bold uppercase mb-4 mt-8">EDUCATION</h2>
            {educationData.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="font-bold text-sm">{item.institution}</div>
                <div className="text-sm">{item.degree} in {item.field}</div>
                <div className="text-sm">{item.start}</div>
              </div>
            ))}

            {/* Publications Section */}
            {publications.length > 0 && (
              <>
                <h2 className="text-xl font-bold uppercase mb-4 mt-8">PUBLICATIONS</h2>
                {publications.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="font-bold text-sm">{item.title}</div>
                    <div className="text-sm mb-1">{item.date}</div>
                    <div className="text-sm leading-relaxed">{item.description}</div>
                  </div>
                ))}
              </>
            )}

            {/* Awards Section */}
            <h2 className="text-xl font-bold uppercase mb-4 mt-8">AWARDS</h2>
            {awards.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="font-bold text-sm">{item.title}</div>
                <div className="text-sm mb-1">{item.date}</div>
                <div className="text-sm leading-relaxed">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 10pt !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          main {
            padding: 0 !important;
          }

          .container {
            padding: 0.5cm !important;
            max-width: 100% !important;
          }

          h1 {
            font-size: 18pt !important;
            margin-bottom: 0.3cm !important;
          }

          h2 {
            font-size: 11pt !important;
            margin-top: 0.4cm !important;
            margin-bottom: 0.3cm !important;
          }

          h3 {
            font-size: 10pt !important;
            margin-top: 0.3cm !important;
            margin-bottom: 0.2cm !important;
          }

          .grid {
            gap: 1cm !important;
          }

          .mb-6, .mb-4, .mb-8 {
            margin-bottom: 0.3cm !important;
          }

          .mt-8 {
            margin-top: 0.4cm !important;
          }

          .text-sm, .text-lg {
            font-size: 9pt !important;
            line-height: 1.3 !important;
          }

          .text-xl {
            font-size: 10pt !important;
          }

          .text-4xl {
            font-size: 18pt !important;
          }

          .text-2xl {
            font-size: 11pt !important;
          }

          .leading-relaxed {
            line-height: 1.3 !important;
          }

          ul {
            margin-top: 0.2cm !important;
            margin-bottom: 0.2cm !important;
          }

          li {
            margin-bottom: 0.1cm !important;
          }

          a {
            text-decoration: underline !important;
            color: black !important;
          }

          @page {
            margin: 1cm;
            size: letter;
          }
        }
      `}</style>
    </main>
  );
}
