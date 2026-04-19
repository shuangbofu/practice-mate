import { useMemo, useRef, useState, useEffect } from "react"
import { flushSync } from "react-dom"
import { FloatingBubble, Swiper, SwiperRef } from "antd-mobile"
import { doubleClick } from "../../utils/common"
import { PracticeItem } from "../../types"
import BackLayout from "../../components/BackLyaout"
import { RedoOutline } from "antd-mobile-icons"
import classNames from "classnames"
import MarkdownRender from "../../components/MarkdownRender"

interface PractiseProps {
    prac: boolean
    questionPool: PracticeItem[]
    refresh: (() => void) | false
    back: () => void
}

const PracticePage = (props: PractiseProps) => {
    const { prac, questionPool, refresh, back } = props
    const [index, setIndex] = useState<number>(0)
    const item = useMemo(() => questionPool[index], [questionPool, index])
    const ref = useRef<SwiperRef>(null)

    const [hiddenAnswer, setHiddenAnswer] = useState<Boolean>(prac)
    const doubleTapTimestamp = useRef<number>(0)

    // 监听键盘事件
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleAnswer()
            }
        }
        
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const renderTitle = () => {
        return item ? <div className="flex items-center gap-2">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                第{[index + 1]}/{questionPool.length}题
            </div>
            <div className="text-xs flex items-end gap-2 break-all" style={{ lineHeight: 1 }}>
                <div>{item.topicName}</div>
                <div>/ {item.categoryName}</div>
            </div>
        </div> : <></>
    }
    const renderTip = (className: string) => {
        return <div className={classNames('text-sm text-neutral-600', className)}>
            <div className="flex flex-col gap-1">
                <div>💻 电脑：按 Enter/空格 切换答案</div>
                <div>📱 手机：双击屏幕 切换答案</div>
            </div>
        </div>
    }

    // 处理移动端触摸双击
    const touchStartTime = useRef<number>(0)
    const handleTouchEnd = (e: React.TouchEvent) => {
        // 如果触摸目标是图片，不处理双击
        if ((e.target as HTMLElement).closest('img')) {
            return
        }
        const now = Date.now()
        if (now - touchStartTime.current < 300 && now - touchStartTime.current > 50) {
            // 300ms 内两次点击判定为双击
            toggleAnswer()
        }
        touchStartTime.current = now
    }

    // 立即切换答案显示状态
    const toggleAnswer = () => {
        // 使用 flushSync 确保状态立即更新并同步渲染
        flushSync(() => {
            setHiddenAnswer(pre => !pre);
        });
        // 记录双击时间戳，在接下来 300ms 内忽略图片点击
        doubleTapTimestamp.current = Date.now();
    };

    const renderContent = () => {
        return <Swiper ref={ref} onIndexChange={(index) => {
            setIndex(index)
            if (prac) {
                setHiddenAnswer(true)
            }
            // 切换题目时，触发所有图片组件的 src 变化，会自动关闭预览
        }} defaultIndex={index} allowTouchMove={true} style={{ "--height": '100%' }}>{questionPool.map((item, idx) => {
            const markdownKey = item.id || `${idx}-${item.question?.substring(0, 20)}`;
            return <Swiper.Item className="h-full relative" key={item.id || idx}>
                <div className="h-full relative flex flex-col">
                    {!hiddenAnswer && <div className="text-lg dark:text-white mb-1" style={{ flex: '0 0 auto' }}>
                        <div className="break-all pt-2 pl-4 text-xl text-neutral-700 dark:text-neutral-400 flex items-center flex-wrap gap-2">
                            {item.question}
                            {renderTip(' text-xs')}
                            {/* {renderStar(item, 'my-2 justify-start text-[10px]')} */}
                        </div>
                    </div>}
                    <div 
                        onClick={(e) => {
                            // 如果点击目标是图片，不处理双击
                            if ((e.target as HTMLElement).closest('img')) {
                                return
                            }
                            doubleClick((_, double) => double && toggleAnswer(), 150)(e)
                        }}
                        onTouchEnd={handleTouchEnd}
                        className={`flex-1 min-h-0 h-full w-full overflow-auto flex flex-col items-center
					${hiddenAnswer ? ' justify-center pb-20' : 'justify-start'}`}>
                        {/* 始终渲染题目，通过 CSS 控制显示/隐藏 */}
                        <div className="p-4 text-5xl text-center break-all text-neutral-700 dark:text-neutral-400" style={{ touchAction: 'manipulation', display: hiddenAnswer ? 'block' : 'none' }}>
                            {item.question}
                            {renderTip('mt-10')}
                            {/* {renderStar(item, 'mt-8 justify-center')} */}
                        </div>
                        {/* 始终渲染答案，通过 CSS 控制显示/隐藏 */}
                        <div className="px-4 w-full h-full pb-4 overflow-auto" style={{ touchAction: 'manipulation', display: !hiddenAnswer ? 'block' : 'none' }}>
                            <MarkdownRender key={markdownKey} value={item.answer} 
                                onClickCapture={() => {
                                    const now = Date.now()
                                    // 如果在双击后 300ms 内，阻止点击
                                    if (now - doubleTapTimestamp.current < 300 && now - doubleTapTimestamp.current >= 0) {
                                        return false
                                    }
                                    return true
                                }} />
                        </div>
                    </div>
                </div>
            </Swiper.Item>
        })}
        </Swiper>
    }
    return <>{<BackLayout back={back}
        title={renderTitle()}>
        <div className="dark:bg-neutral-800 h-full w-full relative">
            {renderContent()}
        </div>
        {refresh && <FloatingBubble
            axis='xy'
            magnetic='x'
            style={{
                '--initial-position-top': '100px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
                '--background': 'rgba(0,0,0,.5)',
                '--size': '50px',
            }}
            onClick={refresh}
        >
            <div className=" flex flex-col justify-center gap-0.5">
                <RedoOutline className=" font-bold text-3xl text-gray-400" />
            </div>
        </FloatingBubble>}
    </BackLayout>}
    </>
}

export default PracticePage