import { format, parseISO } from "date-fns";
import { allNewsletters } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allNewsletters.map((newsletter) => ({ slug: newsletter._raw.flattenedPath }));

export const generateMetadata = ({ params }) => {
  const newsletter = allNewsletters.find(
    (newsletter) => newsletter._raw.flattenedPath === params.slug
  );
  return { title: newsletter.title };
};

const NewsletterLayout = ({ params }: { params: { slug: string } }) => {
  const newsletter = allNewsletters.find(
    (newsletter) => newsletter._raw.flattenedPath === params.slug
  );

  const Content = getMDXComponent(newsletter.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time dateTime={newsletter.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(newsletter.date), "LLLL d, yyyy")}
        </time>
        <h1>{newsletter.title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default NewsletterLayout;
