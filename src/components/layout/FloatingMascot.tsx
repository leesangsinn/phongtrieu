"use client";

import { Mascot } from "page-mascot";

export default function FloatingMascot() {
  return (
    <div className="fixed bottom-4 left-4 sm:left-6 z-[60]">
      <Mascot
        directions="/mascots/phongtrieu-directions.webp"
        reactions="/mascots/phongtrieu-reactions.webp"
        size={96}
        label="Bé Cá Phong Triều"
      />
    </div>
  );
}
