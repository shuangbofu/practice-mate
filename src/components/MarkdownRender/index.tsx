import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from 'rehype-highlight'
import { useEffect } from "react"
import { useDarkMode } from "../../utils/hook"

const MarkdownRender = (props: { value: string }) => {
    const isDark = useDarkMode()
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'hljs-theme';
        link.href = isDark
            ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css'
            : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css';
        const old = document.getElementById('hljs-theme');
        if (old) document.head.removeChild(old);
        document.head.appendChild(link);
    }, [isDark]);
    return <ReactMarkdown
        children={props.value}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
    />
}

export default MarkdownRender