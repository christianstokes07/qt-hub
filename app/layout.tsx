import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QT Hub | Hampton University Internships",
  description: "Find your dream internship as a Hampton University sophomore or junior.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Nunito 800 = rounded, friendly, matches logo font */}
        {/* Playfair Display = elegant serif for founder section */}
        {/* DM Sans = clean body text, nav, buttons, labels */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased bg-white"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}