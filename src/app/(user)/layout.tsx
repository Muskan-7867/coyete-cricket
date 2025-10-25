import Navbar from "@/components/user/navbar/Navbar";
import Footer from "@/components/user/footer/Footer";
import React, { Suspense } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
       <Suspense fallback={<div>Loading navbar...</div>}>
          <Navbar />
        </Suspense>
      {children}
      <Footer />
    </div>
  );
}
