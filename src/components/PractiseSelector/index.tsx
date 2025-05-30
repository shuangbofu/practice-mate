import React, { useState, useEffect, CSSProperties } from 'react'
import classNames from 'classnames'
import { Topic, SelectOption } from '../../types'
import { getProgressColor } from '../../utils/common'

const PractiseSelector: React.FC<{
	style?: CSSProperties
	topics: Topic[]
	value: SelectOption
	onValueChange: (options: SelectOption) => void
}> = ({ topics, onValueChange, value, style }) => {
	const [option, setOption] = useState<SelectOption>(value)

	const handleTopicSelect = (topicId: number) => {
		const selectedTopicIndex = option.selectedTopics.indexOf(topicId)
		if (selectedTopicIndex !== -1) {
			// 如果已选择，取消选择主题和相关类别
			setOption(pre => ({
				selectedTopics: pre.selectedTopics.filter(id => id != topicId),
				selectedCategories: pre.selectedCategories.filter(id => {
					const topic = topics.find(t => t.id === topicId)
					return !topic || !topic.categories.map(c => c.id).includes(id)
				})
			}))
		} else {
			// 如果未选择，添加选择主题和相关类别
			const topic = topics.find(t => t.id === topicId)
			setOption(pre => ({
				selectedTopics: [...pre.selectedTopics, topicId],
				selectedCategories: topic ?
					[
						...pre.selectedCategories,
						...topic.categories.map(c => c.id)
					] : pre.selectedCategories
			}))
		}
	}

	const handleCategorySelect = (categoryId: number) => {
		const selectedCategoryIndex = option.selectedCategories.indexOf(categoryId)
		if (selectedCategoryIndex !== -1) {
			setOption(pre => ({ ...pre, selectedCategories: pre.selectedCategories.filter(id => id !== categoryId) }
			))
		} else {
			// 如果未选择，添加选择类别
			setOption(pre => ({ ...pre, selectedCategories: [...pre.selectedCategories, categoryId] }))
		}
	}

	useEffect(() => { onValueChange(option) }, [option])
	
	return (
		<div className='select-none bg-transparent p-2 pb-0 ' style={style}>
			<div className="topic-selection">
				<div className="mb-2 relative">
					<div className='relative flex flex-col sm:flex-row sm:flex-wrap gap-2 '>
						{topics.map((topic, index) => {
							const topicId = topic.id
							const selected = option.selectedTopics.includes(topic.id)
							const color = getProgressColor(index, topics.length)
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
											const categorySelected = option.selectedCategories.includes(category.id)
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

export default PractiseSelector
