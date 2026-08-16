import Link from "next/link";
import { bioLinkClass } from "@/components/landing/bio-shared";

const Bio2014 = () => (
  <div className="text-gray-800 dark:text-textDark">
    <div className="text-2xl font-bold">
      Interaction Designer and Technology Whisperer
    </div>
    <div className="mt-4">
      My mind races 24-7. Wherever I go I’m constantly observing and questioning
      , pondering how to innovate the smallest details to improve the user
      experience. This questioning and curiosity is what drove to me the
      Interaction Design program at{" "}
      <Link href="https://cca.edu" className={bioLinkClass}>
        California College of the Arts
      </Link>
      .
    </div>
    <div className="mt-4">
      Adding to the value of the human experience through good design; this is
      what excites me … this is what drives me.
    </div>
  </div>
);

export default Bio2014;
