import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Silverdab",
  description:
    "Silverdab projects around the world, from the Philippines to the globe.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}