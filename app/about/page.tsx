import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import Content from "./message.md";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="">
      <div className="pb-3">Hey I’m Will,</div>
      <div className="pb-3">
        My day-to-day focus is making{" "}
        <Link
          className="underline underline-offset-2"
          href="https://madefor.earth"
        >
          things for the planet
        </Link>
        , sometimes as a designer and sometimes as a developer. While
        periodically thinking about tea.
      </div>

      <div className="pb-3">
        Last Year, I co-founded{" "}
        <Link
          className="underline underline-offset-2"
          href="https://anthropogenic.com"
        >
          Anthropogenic ↗
        </Link>{" "}
        which <i>was</i> building a new system of accountability, through
        verification and monitoring, for financial institutions in preparation
        for pending regulations around emissions reporting.
      </div>
      <div className="pb-3">
        I{" "}
        <Link
          className="underline underline-offset-2"
          href="https://tinyfactories.space/"
        >
          co-run a community ↗
        </Link>{" "}
        of creatives, consisting of indiepreneurs, coders, artists, designers,
        musicians, videographers, writers, animators (and more) who are working
        to support each other in establishing both creative autonomy and
        financial stability. This space allows me to tinker with smaller ideas
        to keep my creative thoughts flowing in a way that is not always
        sustainable at work.
      </div>
      <div className="pb-3">
        In the before times, I worked as a design technologist at research labs
        across all{" "}
        <Link className="underline underline-offset-2" href="/cv">
          types of companies{" "}
        </Link>
        . In these roles, I translated emerging technologies into prototypes in
        which the core tech was abstracted away so that we could focus on the
        intended function.
      </div>
      <div className="">
        {" "}
        Before that was at{" "}
        <Link className="underline underline-offset-2" href="https://cca.edu">
          California College of the Arts ↗
        </Link>{" "}
        pursuing a BFA in{" "}
        <Link
          className="underline underline-offset-2"
          href="https://www.cca.edu/design/ixd/"
        >
          Interaction Design ↗
        </Link>
        .
      </div>
    </main>
  );
}
