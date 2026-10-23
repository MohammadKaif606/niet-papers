import "./globals.css";
import "./extra.css";
import { Lato } from "next/font/google";
import Shell from "@/components/Shell";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "NIET Papers - B.Tech",
  description: "Previous year papers, sessionals, notes and solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
