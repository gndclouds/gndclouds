import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type Newsletter = {
  slug: string;
  title: string;
  content: string;
};

type NewsletterListProps = {
  newsletters: Newsletter[];
};

function preprocessMarkdown(markdown: string): string {
  // Replace single newlines with double newlines to create new paragraphs
  return markdown.replace(/\n/g, "\n\n");
}

const MarkdownComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-blue-500" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-green-500" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-purple-500" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-base" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link className="underline" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-5" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-5" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => <li {...props} />,
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-gray-400 pl-2 text-gray-600"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-100 p-1 rounded" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-100 p-2 rounded" {...props} />
  ),
};

export const NewsletterList: React.FC<NewsletterListProps> = ({
  newsletters,
}) => {
  return (
    <div>
      {newsletters.map((newsletter) => (
        <div
          key={newsletter.slug}
          className="max-w-4xl mx-auto p-5 leading-relaxed text-lg"
        >
          <h2 className="border-b-2 border-gray-300 pb-2">
            {newsletter.title}
          </h2>
          <ReactMarkdown components={MarkdownComponents}>
            {preprocessMarkdown(newsletter.content)}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
};
