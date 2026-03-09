import { useEffect, useState } from 'react';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function useKonamiCode(onSuccess: () => void) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const expected = KONAMI[index].toLowerCase();
      if (key === expected) {
        if (index + 1 === KONAMI.length) {
          onSuccess();
          setIndex(0);
        } else {
          setIndex((i) => i + 1);
        }
      } else {
        setIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, onSuccess]);
}
