import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "A newsletter from gndclouds delivered on a monthly-ish basis.",
};

export default function NewsletterPage() {
  return (
    <main className="">
      <div>
        {/* <Content /> */}
        <div className="w-full">
          <form
            action="https://buttondown.email/api/emails/embed-subscribe/gndclouds"
            method="post"
            target="popupwindow"
            // onSubmit="window.open('https://newsletter.gndclouds.earth', 'popupwindow')"
            className="flex inline-block bg-black"
          >
            <label htmlFor="bd-email"></label>
            <div className="flex flex-grow">
              <input
                type="email"
                name="email"
                id="bd-email"
                className="grow border-black border-t-2  border-b-2 border-l-2 border-r-0 bg-[#EDE4DA] text-sm font-normal text-blue-gray-700 outline outline-0"
                placeholder="hello@gndclouds.earth"
              />
              <input
                type="submit"
                value="Subscribe"
                className="border-black border-t-2 border-r-2 border-l-2 border-b-2 outline outline-0 py-2 px-4 text-center align-middle bg-[#EDE4DA] text-[#101010] dark:bg-[#101010] dark:text-[#EDE4DA] hover:cursor-auto duration-150 hover:translate-x-1 hover:-translate-y-1 transform-gpu"
              />
              <input type="hidden" name="tag" value="MFE → Org" />
            </div>
          </form>
        </div>
      </div>
      <div></div>
    </main>
  );
}
