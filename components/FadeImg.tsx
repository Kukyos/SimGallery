"use client";
import { useCallback, useState } from "react";

// Fades each image in as it arrives instead of popping into place.
// The ref check handles cached images whose onLoad fired before hydration.
export default function FadeImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const ref = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, []);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      ref={ref}
      alt={props.alt ?? ""}
      onLoad={() => setLoaded(true)}
      style={{ ...props.style, opacity: loaded ? 1 : 0, transition: "opacity 0.9s ease" }}
    />
  );
}
