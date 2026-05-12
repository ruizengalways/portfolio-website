import { useEffect, useState } from "react";

type Star = { id: number; size: number; x: number; y: number; opacity: number; animationDuration: number };
type Meteor = { id: number; tailLength: number; x: number; y: number; delay: number; animationDuration: number };


const createStars = (width: number, height: number): Star[] => {
  const numberOfStars = Math.floor((width * height) / 10000);
  return Array.from({ length: numberOfStars }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.5,
    animationDuration: Math.random() * 4 + 2,
  }));
};

const createMeteors = (): Meteor[] => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1920;
  const numberOfMeteors = Math.floor(width / 100); // Scale density to screen size
  return Array.from({ length: numberOfMeteors }, (_, i) => ({
    id: i,
    tailLength: Math.floor(Math.random() * 250 + 150),
    x: Math.random() * 100,
    y: Math.random() * 50,
    delay: Math.random() * (0.8 - 0.2) + 0.2,
    animationDuration: Math.floor(Math.random() * 5 + 5),
  }));
};

export const StarBackground = () => {
  const [stars, setStars] = useState<Star[]>(() =>
    createStars(typeof window === "undefined" ? 0 : window.innerWidth, typeof window === "undefined" ? 0 : window.innerHeight)
  );
  const [meteors] = useState<Meteor[]>(() => createMeteors());

  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
      setStars(createStars(window.innerWidth, window.innerHeight));
      console.log("Stars recalculated!"); 
    }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {window.removeEventListener("resize", handleResize)
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-pulse-subtle"
          style={{
            width: star.size + "px",
            height: star.size + "px",
            left: star.x + "%",
            top: star.y + "%",
            opacity: star.opacity,
            animationDuration: star.animationDuration + "s",
          }}
        />
      ))}

      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="meteor animate-meteor"
          style={{
            "--tail-length": `${meteor.tailLength}px`,
            left: meteor.x + "%",
            top: meteor.y + "%",
            animationDelay: meteor.delay + "s",
            animationDuration: meteor.animationDuration + "s",
          } as React.CSSProperties} 
        />
      ))}
    </div>
  );
};