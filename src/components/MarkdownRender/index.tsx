import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from 'rehype-highlight'
import { useEffect, useMemo } from "react"
import { useDarkMode } from "../../utils/hook"
import ImageZoom from "../ImageZoom"

const MarkdownRender = (props: { value: string; onClickCapture?: () => boolean }) => {
    const isDark = useDarkMode()
    
    // 缓存 Markdown 渲染结果，避免重复计算
    const renderedContent = useMemo(() => (
        <ReactMarkdown
            children={props.value}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
                // 使用 span 包裹避免 p > div 嵌套问题
                img: ({ src, alt }) => (
                    <span className="inline-block">
                        <ImageZoom key={src} src={src || ''} alt={alt} onClickCapture={props.onClickCapture} />
                    </span>
                ),
                pre: ({ node, children, ...props }) => (
                    <pre 
                        {...props}
                        onTouchMove={handleTouchMove}
                        onWheel={handleWheel}
                    >
                        {children}
                    </pre>
                )
            }}
        />
    ), [props.value]);
    useEffect(() => {
        // 动态切换高亮样式
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'hljs-theme';
        link.href = isDark
            ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css'
            : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css';

        // 替换原来的
        const old = document.getElementById('hljs-theme');
        if (old) document.head.removeChild(old);
        document.head.appendChild(link);
    }, [isDark]);

    // 阻止滚动事件冒泡
    const handleTouchMove = (e: React.TouchEvent) => {
        e.stopPropagation();
    }

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    }

    return renderedContent;
}

export default MarkdownRender