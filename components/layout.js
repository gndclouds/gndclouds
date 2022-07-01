import Alert from "../components/alert";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import Meta from "../components/meta";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="bg-backgroundlight dark:bg-backgrounddark text-textlight dark:text-textdark ">
        <Navigation />
        <main className="mx-auto p-8 py-50 font-mono min-h-screen max-w-screen-xl">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
