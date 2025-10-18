import Navbar from "@/components/user/navbar/Navbar";
import Footer from "@/components/user/footer/Footer";
import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
