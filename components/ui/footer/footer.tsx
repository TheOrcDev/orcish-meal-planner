import React from "react";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      className="
        bottom-5 left-5 flex w-max items-center rounded-xl border-l-2
        border-primary bg-primary/40 px-2 text-xs md:fixed
        "
    >
      <p>Smart Eating, Every Day © {year}</p>
    </footer>
  );
}
