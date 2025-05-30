import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyAttribute = (isDark: boolean) => {
      document.documentElement.setAttribute(
        'data-prefers-color-scheme',
        isDark ? 'dark' : 'light'
      )
    }

    // 初始设置
    applyAttribute(mediaQuery.matches)
    setIsDark(mediaQuery.matches)

    // 监听变化
    const handler = (e: MediaQueryListEvent) => {
      applyAttribute(e.matches)
      setIsDark(e.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  return isDark
}

import { useRef } from "react";

export const useScrollToTop = () => {
  const ref = useRef<any>(null);

  const scrollToTop = () => {
    if (ref.current) {
      ref.current.scrollTop = 0; // 将滚动条滚动到顶部
    }
  };

  return { ref, scrollToTop };
};
