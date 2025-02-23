import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('sql', sql);

import { vs as theme, vscDarkPlus as darkTheme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useDarkMode } from "../../utils/hook";
// import { formatJava } from "../utils/format";
// import sqlFormatter from 'sql-formatter'
import { js_beautify } from 'js-beautify'

const regex = /<div\s+class="language-(.*?)\s+line-numbers-mode"\s+data-ext="java">[\s\S]*?<pre\s+class="language-java"><code>(.*?)<\/code><\/pre>[\s\S]*?<\/div>/gi;
const CodeRender = (props: { code: string }) => {
    // const [code, setCode] = useState<string>()
    const dark = useDarkMode()

    // useEffect(() => {
    //     formatCode(props.code).then(setCode)
    // }, [props.code])

    const formatCode = (code: string, language: 'java' | 'sql') => {

        // if (language === 'sql') {
        //     return sqlFormatter.format(code)
        // } else if (language === 'java') {
        //     console.log(js_beautify(code, {}))
        //     return js_beautify(code, {})
        // }
        // console.log(code)
        if (language === 'java') {
            return js_beautify(code, {
                indent_size: 4, // 缩进宽度
                indent_with_tabs: false, // 使用空格代替 Tab
                brace_style: "collapse", // 大括号样式
            })
        }
        return code
    }

    const processString = (dark: boolean, input: string) => {
        // 分割字符串为匹配项和非匹配项数组
        const parts = input.split(regex);

        let map: any = {}
        // 处理每个匹配项
        const processedParts = parts.map((part, index) => {
            const lang = map[index - 1]
            if ((index + 1) % 3 === 0) { // 奇数项是被匹配的内容
                let code = part
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/<span[^>]*>([\s\S]*?)<\/span>/g, '$1')
                    .replace(/<span[^>]*>/g, '')
                    .replace(/<\/span>/g, '')
                return <SyntaxHighlighter
                    key={index}
                    language={lang}
                    style={dark ? darkTheme : theme}
                    showLineNumbers
                    PreTag={'div'}
                >
                    {formatCode(code, lang)}
                </SyntaxHighlighter>
            } else if (index % 3 === 1) {
                map[index] = part
                return <></>
            } else {
                return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />; // 非匹配内容原样保留
            }
        });
        return <div>{processedParts}</div>
    }

    return processString(dark, props.code)
}

export default CodeRender