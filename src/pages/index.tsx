import { useState, useEffect, useMemo } from 'react'
import MultiSelectComponent from './PractiseSelector'
import { useLocalStorageState } from 'ahooks'
import { PracticeItem, PractiseMode, SelectOption, Topic } from '../types'
import PractisePage from './Practise'
import Switch from '../components/Switch'
import InputNumber from '../components/InputNumber'
import Button from '../components/Button'
import axios from 'axios'
import { PRACTISE_MODE_LABEL } from '../constants'

// 随机选择数组中的 n 个元素
function selectRandomNElementsFromArray(array: any[], n: number) {
	// 打乱数组的函数（Fisher-Yates Shuffle 算法）
	function shuffleArray(arr: any[]) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
				;[arr[i], arr[j]] = [arr[j], arr[i]]
		}
		return arr
	}

	const shuffledArray = shuffleArray([...array]) // 克隆并打乱数组
	return shuffledArray.slice(0, n) // 选择前 n 个元素
}

const InterviewQuestionBank = () => {
	const [data, setData] = useState<Topic[]>([])
	const [count, setCount] = useState<number>(30)
	const [questionPool, setQuestionPool] = useState<PracticeItem[]>([])

	useEffect(() => {
		document.title = import.meta.env.VITE_TITLE
		try {
			axios.get(import.meta.env.VITE_DATA_URL).then(res => {
				setData(res.data)
			})
		} catch (err) {
			alert(JSON.stringify(err))
		}
	}, [])

	const [selectedQuestions, setSelectedQuestions] = useState<PracticeItem[]>([])
	const [isRandom, setRandom] = useState<boolean>(true)
	const [practiseMode, setPractiseMode] = useState<PractiseMode>('practise')
	const [selectOption, setSelectOption] = useLocalStorageState<SelectOption>(
		'selectOption',
		{
			defaultValue: {
				selectedCategories: [],
				selectedTopics: []
			}
		}
	)
	const maxLength = useMemo(() => selectedQuestions.length, [selectedQuestions])

	useEffect(() => {
		setSelectedQuestions(
			data.filter(i => selectOption?.selectedTopics.includes(i.id))
				.flatMap(i =>
					i.categories
						.filter(j => selectOption?.selectedCategories.includes(j.id))
						.flatMap(j =>
							j.questions.map(k => ({
								categoryId: j.id,
								topicId: i.id,
								categoryName: j.categoryName,
								topicName: i.topicName,
								...k
							}))
						)
				)
		)
	}, [selectOption])

	useEffect(() => {
		if (count > maxLength && maxLength > 0) {
			setCount(maxLength)
		}
	}, [selectedQuestions])

	const getQuestions = (cnt: number) => {
		cnt = cnt < maxLength ? cnt : maxLength
		return isRandom
			? selectRandomNElementsFromArray(selectedQuestions, cnt)
			: selectedQuestions.slice(0, cnt)
	}

	const startPractice = (count: number) => setQuestionPool(getQuestions(count))

	const renderWelcome = () => {
		const disabled = maxLength === 0
		const label = PRACTISE_MODE_LABEL[practiseMode]
		return (
			<div className="flex flex-col h-full overflow-hidden bg-gray-100 dark:bg-black">
				<MultiSelectComponent
					style={{ flex: 1, overflow: 'auto' }}
					topics={data.sort((a, b) => a.priority - b.priority)}
					onSelectionChange={(selectedTopics, selectedCategories) => {
						setSelectOption({ selectedCategories, selectedTopics })
					}}
				/>
				<div className='p-2 shadow-md bg-white dark:bg-zinc-800
				 dark:text-white flex items-center gap-4 flex-wrap justify-center'
					style={{ flex: '0 0 auto' }}>
					<InputNumber
						showMax={true}
						_size='small'
						disabled={disabled}
						min={10}
						max={maxLength}
						value={count}
						onValueChange={setCount}
					/>
					<Switch
						size='small'
						label='随机'
						// disabled={disabled}
						checked={isRandom}
						onChange={setRandom}
					/>
					<Switch
						//  disabled={disabled} 
						checked={practiseMode === 'learn'}
						onChange={value => setPractiseMode(value ? 'learn' : 'practise')}
						size='small' label={['学习', '练习']} />
					<Button disabled={disabled} onClick={() => startPractice(count)} >
						开始{label}
					</Button>
					<Button disabled={disabled}
						onClick={() => startPractice(maxLength)}>{label}全部</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="overflow-hidden h-screen">
			{questionPool.length > 0 ?
				<PractisePage
					back={() => {
						setQuestionPool([])
						setCount(30)
					}}
					refresh={() => startPractice(count)}
					mode={practiseMode}
					questionPool={questionPool}
				/> : renderWelcome()}
		</div>
	)
}

export default InterviewQuestionBank
