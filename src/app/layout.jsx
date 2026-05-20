import "../globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Time-Tracker  By Afaq",
  description: "Track time, stay productive, and keep things organized.",
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
