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

interface CVItem {
  title: string;
  start: string;
  end: string;
  description: string;
  role: string;
  projects?: number;
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

  return (
    <main
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="container mx-auto p-4">
        {/* Controls */}
        <div className="fixed top-4 right-4 flex gap-4 print:hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Header Section */}
          <div
            className={`col-span-full p-8 rounded-2xl ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-4xl font-bold mb-4">Bill Winters</h1>
                <p
                  className={`text-xl ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Creative Technologist & Developer
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <div className="flex gap-4 flex-wrap">
                  {socialData.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <SocialIcon icon={social.icon} />
                      <span className="text-sm font-medium">
                        {social.username}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div
            className={`md:col-span-2 p-8 rounded-2xl transition-shadow ${
              darkMode
                ? "bg-gray-800 hover:shadow-lg-dark"
                : "bg-gray-50 hover:shadow-lg"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">Experience</h2>
            <div className="space-y-8">
              {cvData.map((item, index) => (
                <div
                  key={index}
                  className={`border-b pb-6 last:border-0 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      {item.start} — {item.end}
                    </span>
                  </div>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {item.description}
                  </p>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Role: {item.role}
                  </p>
                  {item.projects && (
                    <p className="mt-2">
                      <a
                        href={`/projects?cv=${index}`}
                        className="text-blue-500 hover:underline"
                      >
                        View {item.projects} Projects →
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div
            className={`p-8 rounded-2xl transition-shadow ${
              darkMode
                ? "bg-gray-800 hover:shadow-lg-dark"
                : "bg-gray-50 hover:shadow-lg"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">Education</h2>
            <div className="space-y-6">
              {educationData.map((edu, index) => (
                <div
                  key={index}
                  className={`border-b pb-6 last:border-0 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-1">
                    {edu.institution}
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {edu.degree}
                  </p>
                  <p
                    className={`text-sm mb-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {edu.start} — {edu.end}
                  </p>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {edu.location}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {edu.achievements.map((achievement, i) => (
                      <li
                        key={i}
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        • {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Press & Awards Section */}
          <div
            className={`col-span-full p-8 rounded-2xl transition-shadow ${
              darkMode
                ? "bg-gray-800 hover:shadow-lg-dark"
                : "bg-gray-50 hover:shadow-lg"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">Press & Awards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pressAwardsData.map((item, index) => (
                <div key={index} className="group">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                      {item.date}
                    </p>
                    <span className="text-blue-500 group-hover:underline mt-2 inline-block">
                      Read more →
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
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
