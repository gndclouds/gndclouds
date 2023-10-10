import { notFound } from "next/navigation";
import { allLogs } from "contentlayer/generated";

import { Metadata } from "next";
import { Mdx } from "@/components/mdx-components";

interface LogProps {
  params: {
    slug: string[];
  };
}

async function getLogFromParams(params: LogProps["params"]) {
  const slug = params?.slug?.join("/");
  const log = allLogs.find((log) => log.slugAsParams === slug);

  if (!log) {
    null;
  }

  return log;
}

export async function generateMetadata({
  params,
}: LogProps): Promise<Metadata> {
  const log = await getLogFromParams(params);

  if (!log) {
    return {};
  }

  return {
    title: log.title,
    description: log.description,
  };
}

export async function generateStaticParams(): Promise<LogProps["params"][]> {
  return allLogs.map((log) => ({
    slug: log.slugAsParams.split("/"),
  }));
}

export default async function LogPage({ params }: LogProps) {
  const log = await getLogFromParams(params);

  if (!log) {
    notFound();
  }

  return (
    <article className="py-6 prose dark:prose-invert">
      <h1 className="mb-2">{log.title}</h1>
      {log.description && (
        <p className="text-xl mt-0 text-slate-700 dark:text-slate-200">
          {log.description}
        </p>
      )}
      <hr className="my-4" />
      <Mdx code={log.body.code} />
    </article>
  );
}
