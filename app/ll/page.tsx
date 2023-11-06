"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // if you need support for GitHub Flavored Markdown

function LogsPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchPosts(page) {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.are.na/v2/channels/test-ll?page=${page}&per_page=10`
      );
      const data = await res.json();
      // Check if data.contents is an array before setting the state
      if (Array.isArray(data.contents)) {
        setPosts((prevPosts) => [...prevPosts, ...data.contents]);
      } else {
        console.error("data.contents is not an array", data.contents);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
    setLoading(false);
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  }

  const debouncedHandleScroll = debounce(handleScroll, 100);

  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [loading]);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div className="dark:prose-invert">
      <div className="min-w-screen flex">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px] overflow-hidden">
          <Image
            src="https://source.unsplash.com/user/gndclouds"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white uppercase font-bold">
              <Link href="/" className=""></Link>
              <Link href="/" className="font-bol">
                ← gndclouds
              </Link>
              <span className="px-1">/</span>
              <Link href="/logs" className="">
                logs
              </Link>
            </div>

            <div className="text-white font-bold text-largest uppercase"></div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
              <div className="flex justify-start items-center">
                <Link href="https://are.na/gndclouds">
                  <div>
                    are.na <span className="font-mono">↗</span>
                  </div>
                </Link>
              </div>
              <div className="flex justify-center items-center"> </div>
              <div className="flex justify-end items-center"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Notes Section */}{" "}
      <div className="p-4 min-w-screen ">
        {/* Rest of the JSX ... */}
        <div className="py-9 grid grid-cols-1 gap-4">
          {Array.isArray(posts) ? (
            posts.map((d) => (
              <div key={d.id}>
                <div className="flex flex-col space-y-1 mb-4">
                  <div className="col-span-2 uppercase font-bold text-h3">
                    {d.title}
                  </div>
                  <div className="col-span-2">{d.description}</div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {d.content}
                  </ReactMarkdown>
                  {/* Additional JSX */}
                </div>
              </div>
            ))
          ) : (
            <div>Error: Posts data is not available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogsPage;
