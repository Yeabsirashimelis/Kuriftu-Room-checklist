import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" bg-black h-screen flex items-center justify-center overflow-hidden">
      <div className=" w-5xl">{children}</div>
    </div>
  );
}
