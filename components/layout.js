import Alert from "../components/alert";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import Meta from "../components/meta";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className='min-h-screen'>
        <Navigation />
        <main className='mx-auto px-5 py-50 max-w-screen-xl'>{children}</main>
      </div>
      <Footer />
    </>
  );
}
