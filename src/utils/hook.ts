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


export const useContainerWidth = (initialWidth?: number, initialHeight?: number) => {
  const ref = useRef<HTMLDivElement | null>(null); // 容器的 ref
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { contentRect } = entry;
        setWidth(contentRect.width); // 设置宽度
        setHeight(contentRect.height); // 设置高度
      }
    });

    // 监听 ref 容器
    resizeObserver.observe(element);

    return () => {
      // 卸载时移除监听
      resizeObserver.unobserve(element);
    };
  }, []);

  return { ref, width, height };
};

export const useMode = () => {
  const [mode, setMode] = useState<'pc' | 'mobile'>('pc')
  const { ref, width } = useContainerWidth()

  useEffect(() => {
    setMode(width && width <= 500 ? 'mobile' : 'pc')
  }, [width])

  return { mode, ref }
}