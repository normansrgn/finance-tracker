import React from "react";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Sidebar/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="flex bg-[#282C35] flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 ">
            <Header />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
