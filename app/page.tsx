"use client";

import { useEffect, useRef } from "react";
import { experienceHtml, mountExperience } from "../lib/experience";

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return mountExperience(root.current);
  }, []);

  // Only this authored static constant becomes HTML. Never insert user input
  // or untrusted CMS content without replacing this with React rendering.
  return <div ref={root} dangerouslySetInnerHTML={{ __html: experienceHtml }} />;
}
