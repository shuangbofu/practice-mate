<<<<<<< Updated upstream
import { useEffect, useState } from "react"

import { PracticeItem, PractiseMode } from "../../types"
import { LeftOutlined } from "@ant-design/icons"
import Button from "../../components/Button"
import Switch from "../../components/Switch"
import { useScrollToTop } from '../../utils/hook';
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
=======
import { useMemo, useRef, useState } from "react"
import { FloatingBubble, Swiper, SwiperRef } from "antd-mobile"
import { doubleClick } from "../../utils/common"
import MarkdownRender from "../../components/MarkdownRender"
import { PracticeItem } from "../../types"
import BackLayout from "../../components/BackLyaout"
import { RedoOutline } from "antd-mobile-icons"
import classNames from "classnames"
>>>>>>> Stashed changes

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
        return <div className={classNames('text-sm text-neutral-600', className)}>双击{hiddenAnswer ? '查看' : '隐藏'}答案</div>
    }

<<<<<<< Updated upstream
	const renderPracticePage = () => {
		return (
			<div className="h-full relative flex flex-col">
				<div style={{ flex: '0 0 30px', lineHeight: 1 }}
					className="py-3 text-center flex flex-wrap items-end gap-3 text-xl bg-gray-200 dark:bg-zinc-800">
					<LeftOutlined style={{}} className="pt-0 px-2 text-xl" onClick={back} />
					<div className=" text-gray-500 dark:text-gray-400">
						第{[practiceIndex + 1]}/{questionPool.length}题
					</div>
					<div className="text-sm flex items-end gap-2 break-all" style={{ lineHeight: 1 }}>
						<div>
							{questionPool[practiceIndex].topicName}
						</div>
						<div>
							/ {questionPool[practiceIndex].categoryName}
						</div>
					</div>
				</div>
				<div className="text-lg dark:text-white"
					style={{ flex: '0 0 auto' }}>
					{!hiddenAnswer && <div className="break-all text-2xl text-gray-700 dark:text-gray-400 px-2 py-3">
						{questionPool[practiceIndex].question}
					</div>}
				</div>
				<div ref={ref} style={{ flex: 1 }}
					className={`h-full w-full overflow-auto flex flex-col items-center pb-4
					${hiddenAnswer ? ' justify-center' : 'justify-start'}`}>
					{hiddenAnswer && (
						<div className="p-4 text-5xl text-center break-all text-gray-700 dark:text-gray-400">
							{questionPool[practiceIndex].question}
						</div>
					)}
					{!hiddenAnswer && <div className="px-4 w-full h-full">
						<ReactMarkdown
							children={questionPool[practiceIndex].answer}
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeHighlight]}
						/>
					</div>}
				</div>
				<div
					style={{ flex: '0 0 auto' }}
					className="flex p-2 bg-gray-100 dark:bg-zinc-800 w-full flex-wrap gap-2 sm:gap-4 items-center justify-center"
				>
					<Button
						disabled={practiceIndex === 0}
						onClick={() => setPracticeIndex(0)}
					>
						从头开始
					</Button>
					<Button
						disabled={practiceIndex === 0}
						onClick={() => setPracticeIndex(practiceIndex - 1)}
					>
						上一题
					</Button>
					<Button
						disabled={practiceIndex === questionPool.length - 1}
						onClick={() => setPracticeIndex(practiceIndex + 1)}
					>
						下一题
					</Button>
					{practiseMode && <>
						<Button
							onClick={() => setHiddenAnswer(!hiddenAnswer)}
						>
							{hiddenAnswer ? '查看' : '隐藏'}答案
						</Button>
						<Button onClick={refresh}>
							换一批
						</Button>
						<Switch
							label="自动隐藏"
							checked={autoHide}
							onChange={(value: boolean) => setAutoHide(value)}
						/></>}
				</div>
			</div>
		)
	}
	return <div className=" dark:bg-black h-full w-full dark:text-gray-400">
		{renderPracticePage()}
	</div>
=======
    const renderContent = () => {
        return <Swiper ref={ref} onIndexChange={(index) => {
            setIndex(index)
            if (prac) {
                setHiddenAnswer(true)
            }
        }} defaultIndex={index} allowTouchMove={true} style={{ "--height": '100%' }}>{questionPool.map((item, idx) => {
            return <Swiper.Item className="h-full relative" key={idx}>
                <div className="h-full relative flex flex-col">
                    {!hiddenAnswer && <div className="text-lg dark:text-white mb-1" style={{ flex: '0 0 auto' }}>
                        <div className="break-all pt-2 pl-4 text-xl text-neutral-700 dark:text-neutral-400 flex items-center flex-wrap gap-2">
                            {item.question}
                            {renderTip(' text-xs')}
                            {/* {renderStar(item, 'my-2 justify-start text-[10px]')} */}
                        </div>
                    </div>}
                    <div onClick={doubleClick((_, double) => double && setHiddenAnswer(pre => !pre))}
                        className={`flex-1 min-h-0 h-full w-full overflow-auto flex flex-col items-center
					${hiddenAnswer ? ' justify-center pb-20' : 'justify-start'}`}>
                        {hiddenAnswer && (
                            <div className="p-4 text-5xl text-center break-all text-neutral-700 dark:text-neutral-400">
                                {item.question}
                                {renderTip('mt-10')}
                                {/* {renderStar(item, 'mt-8 justify-center')} */}
                            </div>
                        )}
                        {!hiddenAnswer && <div className="px-4 w-full h-full pb-4 overflow-auto">
                            <MarkdownRender value={questionPool[index].answer} />
                        </div>}
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
        <FloatingBubble
            axis='xy'
            magnetic='x'
            style={{
                '--initial-position-top': '100px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
                '--background': 'rgba(0,0,0,.5)',
                '--size': '50px',
            }}
            onClick={() => refresh && refresh()}
        >
            <div className=" flex flex-col justify-center gap-0.5">
                <RedoOutline className=" font-bold text-3xl text-gray-400" />
            </div>
        </FloatingBubble>
    </BackLayout>}
    </>
>>>>>>> Stashed changes
}

export default PracticePage