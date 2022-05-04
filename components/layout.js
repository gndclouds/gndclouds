import Alert from "../components/alert";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import Meta from "../components/meta";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen bg-backgroundlight dark:bg-backgrounddark text-textlight  dark:text-textdark">
        <Navigation />
        <main className="max-w-screen-xl mx-auto px-3 py-50">{children}</main>
      </div>
      <Footer />
    </>
  );
}
