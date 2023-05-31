import { format, parseISO } from "date-fns";
import { allLogs } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allLogs.map((log) => ({ slug: log._raw.flattenedPath }));

export const generateMetadata = ({
  params: { slug, title },
}: {
  params: { slug: string; title: string };
}) => {
  const log = allLogs.find((log) => log._raw.flattenedPath === slug);
  const logTitle = log?.title ?? "Default Title";
  return { title: logTitle };
};

const LogLayout = ({ params }: { params: { slug: string } }) => {
  const log = allLogs.find(
    (log) => log._raw.flattenedPath === params.slug
  ) as (typeof allLogs)[number];

  const Content = getMDXComponent(log.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time dateTime={log.publishedAt} className="mb-1 text-xs text-gray-600">
          {format(parseISO(log.publishedAt), "yyyy-MM-d, ")}
        </time>
        <h1>{log.title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default LogLayout;
