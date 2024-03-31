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
    <div lang="en">
      <div>{children}</div>
    </div>
  );
}
