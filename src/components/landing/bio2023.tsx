import Link from "next/link";

const Bio2023 = () => (
  <div>
    <div className="text-2xl font-bold">Hey I&apos;m Will,</div>
    <div className="mt-4">
      My day-to-day focuses are on implementing web technologies to help monitor
      greenhouse gas emissions. Currently, this takes the form of{" "}
      <Link href="https://earth.api" className="underline underline-offset-4">
        Earth API
      </Link>
      , a data management and visualization tool for bioregions, built-in
      collaboration with{" "}
      <Link
        href="https://Anthropogenic.com"
        className="underline underline-offset-4"
      >
        Anthropogenic
      </Link>
      . I also{" "}
      <Link
        href="https://tinyfactories.space"
        className="underline underline-offset-4"
      >
        co-run a community
      </Link>{" "}
      of creatives, consisting of indiepreneurs, coders, artists, designers,
      musicians, videographers, writers, animators (and more) who are working to
      support each other in establishing both creative autonomy and financial
      stability. This space allows me to tinker with smaller ideas to keep my
      creative thoughts flowing in a way that is not always sustainable at work.
    </div>
    <div className="mt-4">
      In the before times, I worked as a design technologist at research labs
      across all types of companies. In these roles, I translated emerging
      technologies into prototypes in which the core tech was abstracted away so
      that we could focus on the intended function. Before that was at{" "}
      <Link href="https://cca.edu" className="underline underline-offset-4">
        California College of the Arts
      </Link>{" "}
      pursuing a bfa in Interaction Design.
    </div>
    <div className="mt-4">
      Previous at:
      <ul>
        <li>Dark Matter Labs</li>
        <li>Reduct Video</li>
        <li>Protocol Labs</li>
        <li>Udacity</li>
        <li>Xero PARC</li>
        <li>Fjord</li>
        <li>IFTTT</li>
        <li>IDEO CoLab</li>
      </ul>
    </div>
  </div>
);

export default Bio2023;
