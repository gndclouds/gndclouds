export type LogItem = {
  slug: string;
  title: string;
  publishedAt?: string | Date;
  description?: string;
  tags?: string[];
  categories?: string[];
  project?: string | string[];
  projects?: string[] | string;
  metadata?: {
    description?: string;
    contentHtml?: string;
    links?: string[];
    footnotes?: { [key: string]: string };
    project?: string | string[];
    projects?: string[] | string;
    [key: string]: any;
  };
};
