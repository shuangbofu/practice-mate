import { useEffect, useState } from "react"

import { PracticeItem, PractiseMode } from "../../types"
import { LeftOutlined } from "@ant-design/icons"
import Button from "../../components/Button"
import Switch from "../../components/Switch"
import { useScrollToTop } from '../../utils/hook';
import CodeRender from "../CodeRender"

interface PractiseProps {
	mode: PractiseMode
	questionPool: PracticeItem[]
	refresh: () => void
	back: () => void
}

const PractisePage = (props: PractiseProps) => {
	const { mode, questionPool, refresh, back } = props
	const practiseMode = mode === 'practise'
	const [autoHide, setAutoHide] = useState<boolean>(practiseMode)
	const [hiddenAnswer, setHiddenAnswer] = useState<Boolean>(practiseMode)
	const [practiceIndex, setPracticeIndex] = useState<number>(0)
	const { ref, scrollToTop } = useScrollToTop()

	useEffect(() => {
		if (autoHide) setHiddenAnswer(true)
	}, [practiceIndex, autoHide])

	useEffect(() => {
		scrollToTop()
	}, [practiceIndex])

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
						<CodeRender code={questionPool[practiceIndex].answer} />
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
}

export default PractisePage