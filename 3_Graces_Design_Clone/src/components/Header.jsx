import React, { useEffect } from "react";
import { gsap } from "gsap";

export default function Header() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const headerItems = document.querySelectorAll(".header-items");

    const handleMouseMove = (e) => {
      console.log(e);

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, {
        scale: 3,
        duration: 0.3,
        background: "#4d4d4d",
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        background: " #ffff",
        ease: "power2.out",
      });
    };
    headerItems.forEach((item) => {
      item.addEventListener("mouseenter", handleMouseEnter);
      item.addEventListener("mouseleave", handleMouseLeave);
    });

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      headerItems.forEach((item) => {
        item.removeEventListener("mouseenter", handleMouseEnter);
        item.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="header">
        <ul>
          <li className="header-items">ART</li>
          <li className="header-items">ABOUT</li>
          <li className="header-items">VISIT</li>
          <li className="header-items">SHOP</li>
          <li className="header-items">SEARCH</li>
        </ul>
      </div>
      <div id="cursor"></div> {/* Custom cursor */}
    </>
  );
}
