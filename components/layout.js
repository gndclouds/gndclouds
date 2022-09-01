import ErrorPage from "next/error";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import Meta from "../components/meta";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="bg-backgroundlightmode text-textlightmode dark:bg-backgrounddarkmode dark:text-textdarkmode ">
        <Navigation />
        <main className="mx-auto p-8 py-50 font-mono min-h-screen max-w-screen-xl">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
