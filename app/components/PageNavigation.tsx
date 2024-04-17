import Link from "next/link";
import React from "react";

interface PageNavigationProps {
  currentPage: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ currentPage }) => {
  return (
    <div className="text-white uppercase font-bold">
      <Link href="/" className="hover:reveal">
        ← gndclouds
      </Link>
      <span className="px-1">/</span>
      <Link href={`/${currentPage}`} className="">
        {currentPage}
      </Link>
      <style jsx>{`
        .hover:reveal {
          visibility: hidden;
        }
        .hover:reveal:hover {
          visibility: visible;
        }
      `}</style>
    </div>
  );
};

export default PageNavigation;
