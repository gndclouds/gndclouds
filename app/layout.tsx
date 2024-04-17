import "./globals.css";

export const metadata = {
  title: "gndclouds",
  description: "gndclouds",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
