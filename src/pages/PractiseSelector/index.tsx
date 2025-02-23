import React, { useState, useEffect, CSSProperties } from 'react'
import classNames from 'classnames'
import { COLORS, DARK_COLORS } from '../../constants'
import { Topic } from '../../types'
import { useDarkMode } from '../../utils/hook'

const MultiSelectComponent: React.FC<{
	style?: CSSProperties
	topics: Topic[]
	onSelectionChange: (
		selectedTopics: number[],
		selectedCategories: number[]
	) => void
}> = ({ topics, onSelectionChange, style }) => {
	const [selectedTopics, setselectedTopics] = useState<number[]>([])
	const [selectedCategories, setSelectedCategories] = useState<number[]>([])
	const dark = useDarkMode()

	const handleTopicSelect = (topicId: number) => {
		const selectedTopicIndex = selectedTopics.indexOf(topicId)
		if (selectedTopicIndex !== -1) {
			// 如果已选择，取消选择主题和相关类别
			setselectedTopics(pre => pre.filter(id => id !== topicId))
			setSelectedCategories(prevCategories =>
				prevCategories.filter(id => {
					const topic = topics.find(t => t.id === topicId)
					return !topic || !topic.categories.map(c => c.id).includes(id)
				})
			)
		} else {
			// 如果未选择，添加选择主题和相关类别
			setselectedTopics(prevTopics => [...prevTopics, topicId])
			const topic = topics.find(t => t.id === topicId)
			if (topic) {
				setSelectedCategories(prevCategories => [
					...prevCategories,
					...topic.categories.map(c => c.id)
				])
			}
		}
	}

	const handleCategorySelect = (categoryId: number) => {
		const selectedCategoryIndex = selectedCategories.indexOf(categoryId)
		if (selectedCategoryIndex !== -1) {
			// 如果已选择，取消选择类别
			setSelectedCategories(prevCategories =>
				prevCategories.filter(id => id !== categoryId)
			)
		} else {
			// 如果未选择，添加选择类别
			setSelectedCategories(prevCategories => [...prevCategories, categoryId])
		}
	}

	useEffect(() => {
		onSelectionChange(selectedTopics, selectedCategories)
	}, [selectedTopics, selectedCategories])

	return (
		<div className='select-none bg-transparent p-2 pb-0 ' style={style}>
			<div className="topic-selection">
				<div className="mb-2 relative">
					<div className='relative flex flex-col sm:flex-row sm:flex-wrap gap-2 '>
						{topics.map((topic, index) => {
							const topicId = topic.id
							const selected = selectedTopics.includes(topic.id)
							const color = (dark ? DARK_COLORS : COLORS)[index]
							return <div className={classNames(' rounded-md cursor-pointer p-4 bg-white  relative dark:brightness-50',
								selected ? 'border' : 'p-8',
							)}
								key={topicId}
								style={{
									backgroundColor: !selected ? color : 'transparent',
									borderColor: selected ? color : ''
								}}
								onClick={() => handleTopicSelect(topicId)}
							>
								<div className='flex items-center justify-between'>
									<div style={{
										color: !selected ? '#fff' : color,
									}} className={classNames(' w-full',
										selected ? 'font-bold text-2xl' : ' font-thin text-center text-3xl')}>{topic.topicName}</div>
								</div>
								{selected && <div className="flex flex-wrap pt-4">
									<div className='flex flex-wrap gap-2 relative'>
										{topic?.categories.map(category => {
											const categorySelected = selectedCategories.includes(category.id)
											return <div style={{
												backgroundColor: !categorySelected ? '' : color,
												color: !categorySelected ? color : '#fff',
												borderColor: !categorySelected ? color : ''
											}}
												className={classNames(' text-lg relative rounded-md px-8 py-4 border cursor-pointer',
													categorySelected && ' border dark:border-stone-600'
												)}
												onClick={(e) => {
													handleCategorySelect(category.id)
													e.stopPropagation()
												}}
												key={category.id}>
												{category.categoryName}
											</div>
										})}
									</div>
								</div>}
							</div>
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default MultiSelectComponent
