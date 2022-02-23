import { useState } from "react";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Maps() {
  const { asPath, pathname } = useRouter();

  return (
    <>
      <Head>
        <title>
          {OG_NAME} {pathname}
        </title>
        <link
          href='https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css'
          rel='stylesheet'
        />
        <DynamicComponentWithNoSSR />
      </Head>
      );
    </>
  );
}
