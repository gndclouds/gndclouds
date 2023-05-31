import { format, parseISO } from "date-fns";
import { allNewsletters } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allNewsletters.map((newsletter) => ({ slug: newsletter._raw.flattenedPath }));

export const generateMetadata = ({
  params: { slug, title },
}: {
  params: { slug: string; title: string };
}) => {
  const newsletter = allNewsletters.find(
    (newsletter) => newsletter._raw.flattenedPath === slug
  );
  const newsletterTitle = newsletter?.title ?? "Default Title";
  return { title: newsletterTitle };
};

const NewsletterLayout = ({ params }: { params: { slug: string } }) => {
  const newsletter = allNewsletters.find(
    (newsletter) => newsletter._raw.flattenedPath === params.slug
  ) as (typeof allNewsletters)[number];

  const Content = getMDXComponent(newsletter.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time
          dateTime={newsletter.publishedAt}
          className="mb-1 text-xs text-gray-600"
        >
          {format(parseISO(newsletter.publishedAt), "yyyy-MM-d, ")}
        </time>
        <h1>{newsletter.title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default NewsletterLayout;
