import { notFound } from "next/navigation";
import { allNewsletters } from "contentlayer/generated";

import { Metadata } from "next";
import { Mdx } from "@/components/mdx-components";

interface NewsletterProps {
  params: {
    slug: string[];
  };
}

async function getNewsletterFromParams(params: NewsletterProps["params"]) {
  const slug = params?.slug?.join("/");
  const newsletter = allNewsletters.find(
    (newsletter) => newsletter.slugAsParams === slug
  );

  if (!newsletter) {
    null;
  }

  return newsletter;
}

export async function generateMetadata({
  params,
}: NewsletterProps): Promise<Metadata> {
  const newsletter = await getNewsletterFromParams(params);

  if (!newsletter) {
    return {};
  }

  return {
    title: newsletter.title,
    description: newsletter.description,
  };
}

export async function generateStaticParams(): Promise<
  NewsletterProps["params"][]
> {
  return allNewsletters.map((newsletter) => ({
    slug: newsletter.slugAsParams.split("/"),
  }));
}

export default async function NewsletterPage({ params }: NewsletterProps) {
  const newsletter = await getNewsletterFromParams(params);

  if (!newsletter) {
    notFound();
  }

  return (
    <article className="py-6 prose dark:prose-invert">
      <h1 className="mb-2">{newsletter.title}</h1>

      <hr className="my-4" />
      <Mdx code={newsletter.body.code} />
    </article>
  );
}
