import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getNewsletterBySlug,
  Newsletter as ImportedNewsletter,
} from "@/queries/newsletters";

type Newsletter = ImportedNewsletter & {
  additionalProperty?: string; // Example additional property
};

export default function NewsletterPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);

  useEffect(() => {
    async function fetchNewsletter() {
      if (slug) {
        const newsletterSlug = Array.isArray(slug)
          ? slug.join("-").toLowerCase()
          : slug.toLowerCase();
        const fetchedNewsletter = await getNewsletterBySlug(newsletterSlug);
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
      <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
    </div>
  );
}
