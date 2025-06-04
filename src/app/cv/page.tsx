"use client";

import { useEffect, useState } from "react";
import {
  RiGithubLine,
  RiLinkedinLine,
  RiTwitterXLine,
  RiDribbbleLine,
  RiGlobalLine,
  RiPrinterLine,
  RiMoonLine,
  RiSunLine,
} from "react-icons/ri";
import CollectionHero from "@/components/collection-hero";
import ListView from "@/components/list-view";

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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(isDark);
    }

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
      description: item.description,
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
      description: item.title,
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
    description: `${item.degree} in ${item.field}`,
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
      <CollectionHero name="CV" projects={allData} allProjects={allData} />

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="fixed top-4 right-4 flex gap-4 print:hidden z-50">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
            } hover:opacity-80 transition-opacity`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <RiSunLine className="w-5 h-5" />
            ) : (
              <RiMoonLine className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handlePrint}
            className={`p-2 rounded-full ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
            } hover:opacity-80 transition-opacity`}
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
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <SocialIcon icon={social.icon} />
              <span className="text-sm font-medium">{social.username}</span>
            </a>
          ))}
        </div>

        {/* Experience Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Experience</h2>
          <ListView data={experienceData} variant="feed" />
        </div>

        {/* Clients Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Clients & Collaborations</h2>
          <ListView data={clientData} variant="feed" />
        </div>

        {/* Education Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Education</h2>
          <ListView data={educationDataFormatted} variant="feed" />
        </div>

        {/* Press & Awards Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Press & Awards</h2>
          <ListView data={pressAwardsDataFormatted} variant="feed" />
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
