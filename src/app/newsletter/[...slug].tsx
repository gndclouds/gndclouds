import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getNewsletterBySlug,
  Newsletter as ImportedNewsletter,
} from "@/queries/newsletters";

// Extend the ImportedNewsletter type if additional properties are needed locally
type Newsletter = ImportedNewsletter & {
  additionalProperty?: string; // Example additional property
};

export default function NewsletterPage() {
  const router = useRouter();
  const { slug } = router.query; // `slug` is an array of path segments
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);

  useEffect(() => {
    async function fetchNewsletter() {
      if (slug) {
        const newsletterSlug = Array.isArray(slug) ? slug.join("-") : slug;
        const fetchedNewsletter = await getNewsletterBySlug(newsletterSlug);
        if (fetchedNewsletter) {
          console.log(fetchedNewsletter.title); // Outputs the title of the newsletter
        } else {
          console.log("Newsletter not found or error reading the file.");
        }
        setNewsletter(fetchedNewsletter);
      }
    }

    fetchNewsletter();
  }, [slug]);

  if (!newsletter) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{newsletter.title}</h1>
      {/* <div dangerouslySetInnerHTML={{ __html: newsletter.metadata.contentHtml }} /> */}
    </div>
  );
}
