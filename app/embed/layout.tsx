// Minimal layout for the embeddable widget — no header, no nav
import LanguageProvider from "@/components/LanguageProvider";

export const metadata = {
  title: "Riga Contemporary Art Fair — Browse Artworks",
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
