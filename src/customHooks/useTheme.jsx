import { useEffect, useState } from "react";

/**
 * Custom hook to determine if the current theme is dark.
 *
 * @returns {boolean} Whether the theme is dark.
 */
const useTheme = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("theme-dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return dark;
};

export default useTheme;