import { useState, useEffect, useRef } from 'react';

const SECTION_IDS = ['about', 'skills', 'experience', 'projects', 'contact'];

export function useActiveSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const visibilityRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const visibility = visibilityRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (SECTION_IDS.includes(id)) {
            visibility[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
          }
        }
        const best = Object.entries(visibility).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ['', 0] as [string, number]
        );
        setActiveId(best[1] > 0 ? best[0] : null);
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return activeId;
}
