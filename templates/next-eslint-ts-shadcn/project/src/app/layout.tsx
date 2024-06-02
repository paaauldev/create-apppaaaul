import type {Metadata} from "next";

import "./globals.css";

const font = Nunito({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "{{name}}",
  description: "A project by Paaauldev",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}
      </body>
    </html>
  );
}
