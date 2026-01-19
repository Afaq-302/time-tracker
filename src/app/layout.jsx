import "../globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Lovable App",
  description: "Lovable Generated Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
