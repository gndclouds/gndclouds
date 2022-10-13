import Head from "next/head";
import { useRouter } from "next/router";

import { OG_NAME, HOME_OG_IMAGE_URL } from "../lib/constants";

export default function Meta() {
  const { asPath, pathname } = useRouter();

  return (
    <Head>
      <title>
        {OG_NAME} {pathname}
      </title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicons/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicons/safari-pinned-tab.svg"
        color="#000000"
      />
      <link rel="shortcut icon" href="/favicons/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta
        name="description"
        content={`A statically generated blog example using Next.js and ${OG_NAME}.`}
      />
      <meta property="og:image" content={HOME_OG_IMAGE_URL} />
      <script
        async
        defer
        data-website-id="d0310b26-9820-4f75-8939-200ecdfc29a0"
        src="https://umami.tinyfactories.space/umami.js"
      ></script>
    </Head>
  );
}
