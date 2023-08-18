import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div className="">
        <div className="pb-3">Hey I’m Will,</div>
        <div className="pb-3">
          My day-to-day focus is making{" "}
          <Link
            className="underline underline-offset-2"
            href="https://madefor.earth"
          >
            things for the planet
          </Link>
          , sometimes as a designer and sometimes as a developer. My next big
          project focuses on{" "}
          <Link className="underline underline-offset-2" href="/">
            shifting our collective means of consumption
          </Link>{" "}
          into practices that allow humanity to become better planetary
          stewards. While periodically thinking about tea.
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
          ,called Tiny Factories, of creatives, consisting of indiepreneurs,
          coders, artists, designers, musicians, videographers, writers,
          animators (and more) who are working to support each other in
          establishing both creative autonomy and financial stability. This
          space allows me to tinker with smaller ideas to keep my creative
          thoughts flowing in a way that is not always sustainable at work.
        </div>
        <div className="pb-3">
          In the before times, I worked as a design technologist at research
          labs across all{" "}
          <Link className="underline underline-offset-2" href="/things#teams">
            types of companies
          </Link>
          . In these roles, I translated emerging technologies into prototypes
          in which the core tech was abstracted away so that we could focus on
          the intended function.
        </div>
        <div className="pb-3">
          {" "}
          At the start I was at{" "}
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
        <div className="pb-3"></div>
      </div>
      <div className="">
        <Image
          src="/will/2023_headshot.JPG"
          alt="Black and White photo of Will taking his own photo in the reflection of a pain of glass."
          width={500}
          height={500}
        />
      </div>
    </main>
  );
}
