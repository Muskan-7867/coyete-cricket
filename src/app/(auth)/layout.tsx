import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center"
        style={{ backgroundImage: `url('https://png.pngtree.com/thumb_back/fh260/background/20241030/pngtree-full-stadium-view-of-a-cricket-match-at-dusk-image_16473369.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/55" />
        {children}
      </div>
    </div>
  );
}
