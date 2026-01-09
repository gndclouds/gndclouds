"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  RiGithubLine,
  RiLinkedinLine,
  RiTwitterXLine,
  RiDribbbleLine,
  RiGlobalLine,
  RiPrinterLine,
} from "react-icons/ri";
import CollectionHero from "@/components/collection-hero";
import ListView from "@/components/list-view";
import Bio2025 from "@/components/landing/bio2025";

interface CVItem {
  title: string;
  start: string;
  end: string;
  description: string;
  company: string;
  location: string;
  type: "full-time" | "client";
  responsibilities: string[];
  projects?: number;
  collaborators?: string[];
}

interface PressAwardItem {
  title: string;
  date: string;
  link: string;
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

interface SocialItem {
  platform: string;
  url: string;
  username: string;
  icon: string;
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

const fetchSocialData = async (): Promise<SocialItem[]> => {
  const response = await fetch("/data/social.json");
  if (!response.ok) {
    throw new Error("Failed to fetch social data");
  }
  return response.json();
};

const SocialIcon = ({ icon }: { icon: string }) => {
  const iconClass = "w-5 h-5";
  switch (icon.toLowerCase()) {
    case "github":
      return <RiGithubLine className={iconClass} />;
    case "linkedin":
      return <RiLinkedinLine className={iconClass} />;
    case "twitter":
      return <RiTwitterXLine className={iconClass} />;
    case "dribbble":
      return <RiDribbbleLine className={iconClass} />;
    case "arena":
      return <RiGlobalLine className={iconClass} />;
    default:
      return <RiGlobalLine className={iconClass} />;
  }
};

export default function CVPage() {
  const [cvData, setCVData] = useState<CVItem[]>([]);
  const [pressAwardsData, setPressAwardsData] = useState<PressAwardItem[]>([]);
  const [educationData, setEducationData] = useState<EducationItem[]>([]);
  const [socialData, setSocialData] = useState<SocialItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cv, pressAwards, education, social] = await Promise.all([
          fetchCVData(),
          fetchPressAwardsData(),
          fetchEducationData(),
          fetchSocialData(),
        ]);
        setCVData(cv);
        setPressAwardsData(pressAwards);
        setEducationData(education);
        setSocialData(social);
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

  // Convert CV data to ListView format
  const experienceData = cvData
    .filter((item) => item.type === "full-time")
    .map((item) => ({
      title: item.title,
      description: `${item.company} • ${item.location} • ${item.start} - ${item.end}\n${item.description}`,
      publishedAt: item.start,
      url: `/cv/${item.company.toLowerCase().replace(/\s+/g, "-")}`,
      tags: item.responsibilities,
      metadata: {
        company: item.company,
        location: item.location,
        start: item.start,
        end: item.end,
        projects: item.projects,
      },
    }));

  const clientData = cvData
    .filter((item) => item.type === "client")
    .map((item) => ({
      title: item.company,
      description: `${item.title} • ${item.location} • ${item.start} - ${item.end}\n${item.description}`,
      publishedAt: item.start,
      url: `/cv/${item.company.toLowerCase().replace(/\s+/g, "-")}`,
      tags: item.responsibilities,
      metadata: {
        company: item.company,
        location: item.location,
        start: item.start,
        end: item.end,
      },
    }));

  const educationDataFormatted = educationData.map((item) => ({
    title: item.institution,
    description: `${item.degree} in ${item.field} • ${item.location} • ${
      item.start
    } - ${item.end}\n${item.achievements.join(", ")}`,
    publishedAt: item.start,
    url: `/cv/${item.institution.toLowerCase().replace(/\s+/g, "-")}`,
    tags: item.achievements,
    metadata: {
      location: item.location,
      start: item.start,
      end: item.end,
    },
  }));

  const pressAwardsDataFormatted = pressAwardsData.map((item) => ({
    title: item.title,
    description: item.date,
    publishedAt: item.date,
    url: item.link,
    metadata: {
      date: item.date,
    },
  }));

  const allData = [
    ...experienceData,
    ...clientData,
    ...educationDataFormatted,
    ...pressAwardsDataFormatted,
  ];

  return (
    <main className="min-h-screen">
      <CollectionHero
        name="CV"
        projects={allData}
        allProjects={allData}
        showEntriesCount={false}
        showRssLink={false}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Bio Section with Image */}
        <div className="mb-12 grid grid-cols-3 gap-8">
          {/* Image Column */}
          <div className="relative   overflow-hidden">
            <Image
              src="/me/2025_headshot.jpeg"
              alt="Will's portrait"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Bio Text Column */}
          <div className="col-span-2 prose prose-lg max-w-none">
            <Bio2025 />
          </div>
        </div>

        {/* Controls */}
        <div className="fixed top-4 right-4 flex gap-4 print:hidden z-50">
          <button
            onClick={handlePrint}
            className="p-2 rounded-full bg-gray-100 text-gray-800 hover:opacity-80 transition-opacity"
            aria-label="Print CV"
          >
            <RiPrinterLine className="w-5 h-5" />
          </button>
        </div>

        {/* Social Links */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {socialData.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors bg-white hover:bg-gray-100"
            >
              <SocialIcon icon={social.icon} />
              <span className="text-sm font-medium">{social.username}</span>
            </a>
          ))}
        </div>

        {/* Experience Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Experience</h2>
          <ListView data={experienceData} variant="default" />
        </div>

        {/* Clients Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Clients & Collaborations</h2>
          <ListView data={clientData} variant="default" />
        </div>

        {/* Education Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Education</h2>
          <ListView data={educationDataFormatted} variant="default" />
        </div>

        {/* Press & Awards Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Press & Awards</h2>
          <ListView data={pressAwardsDataFormatted} variant="default" />
        </div>
      </div>

      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          main {
            padding: 0 !important;
          }

          a {
            text-decoration: none !important;
            color: black !important;
          }

          .rounded-2xl {
            border-radius: 0 !important;
          }

          .bg-gray-50,
          .bg-gray-800,
          .bg-gray-900 {
            background: white !important;
          }

          .text-gray-300,
          .text-gray-400,
          .text-gray-500,
          .text-gray-600 {
            color: #4b5563 !important;
          }

          .hover\\:shadow-lg,
          .hover\\:shadow-lg-dark {
            box-shadow: none !important;
          }

          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </main>
  );
}
