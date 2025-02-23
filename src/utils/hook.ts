import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    // 监听主题变化
    const handleChange = (e: any) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // 清理监听器
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDark;
};

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
