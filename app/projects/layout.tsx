export const metadata = {
  title: "gndclouds",
  description: "Generated by gndclouds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}