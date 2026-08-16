"use client";

import { useEffect, useState } from "react";

interface ObfuscatedEmailProps {
  className?: string;
}

/**
 * Obfuscated email component that makes it harder for scrapers to extract the email address.
 * Uses multiple obfuscation techniques:
 * - Splits email into parts stored separately in data attributes
 * - Uses character codes and reversed strings
 * - Combines parts client-side via JavaScript
 * - No plain text email in HTML source
 * - Reverses parts to make simple regex matching harder
 */
export default function ObfuscatedEmail({ className = "" }: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string>("");
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(() => {
    // Decode obfuscated email parts
    // Parts are stored reversed and split
    const decodeEmail = () => {
      // Obfuscated parts (reversed)
      const parts = [
        "sduolcdng",  // gndclouds reversed
        String.fromCharCode(64), // @
        "mp",         // pm reversed
        String.fromCharCode(46), // .
        "em"          // me reversed
      ];
      
      // Reverse each text part and decode char codes
      const decoded = parts.map(part => {
        if (part === String.fromCharCode(64)) return "@";
        if (part === String.fromCharCode(46)) return ".";
        return part.split("").reverse().join("");
      });
      
      return decoded.join("");
    };
    
    const decodedEmail = decodeEmail();
    setEmail(decodedEmail);
    
    // Display format: "gndclouds at pm dot me"
    const displayParts = decodedEmail.split("@");
    const domainParts = displayParts[1].split(".");
    const displayFormat = `${displayParts[0]} at ${domainParts[0]} dot ${domainParts[1]}`;
    setDisplayText(displayFormat);
  }, []);

  // Show obfuscated version until JavaScript loads
  if (!email) {
    // Store parts in data attributes (reversed and split)
    // This makes it harder for simple scrapers to extract
    return (
      <span 
        className={className}
        data-a="sduolcdng"
        data-b="&#64;"
        data-c="mp"
        data-d="&#46;"
        data-e="em"
        suppressHydrationWarning
        style={{ 
          opacity: 0,
          position: "absolute",
          left: "-9999px"
        }}
      >
        <noscript>
          <span style={{ display: "none" }}>email protected</span>
        </noscript>
      </span>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      aria-label="Email address"
      rel="nofollow"
    >
      {displayText}
    </a>
  );
}
