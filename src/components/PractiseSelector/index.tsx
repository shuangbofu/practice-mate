import React, { useState, useEffect, CSSProperties } from 'react'
import classNames from 'classnames'
import { Topic, SelectOption } from '../../types'
import { getProgressColor } from '../../utils/common'
import { Dialog } from 'antd-mobile'

const PractiseSelector: React.FC<{
	style?: CSSProperties
	topics: Topic[]
	value: SelectOption
	onValueChange: (options: SelectOption) => void
}> = ({ topics, onValueChange, value, style }) => {
	const [option, setOption] = useState<SelectOption>(value)
	const [openIndex, setOpenIndex] = useState<number>(-1)

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
		<div className='select-none bg-transparent p-2' style={style}>
			<div className='relative sm:flex-row sm:flex-wrap grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 '>
				{topics.map((topic, index) => {
					const topicId = topic.id
					const selected = option.selectedTopics.includes(topic.id)
					const color = getProgressColor(index, topics.length)
					return <div className={classNames(
						'dark:bg-neutral-800 h-full p-4 lg:p-8 rounded-sm',
						'aspect-[4/3] text-center justify-center flex items-center',
						'cursor-pointer bg-white relative dark:brightness-90',
						'text-base lg:text-3xl xl:text-4xl xl:font-thin font-light',
						selected ? ' text-white' : 'order',
					)}
						key={topicId}
						style={{ backgroundColor: selected ? color : '' }}
						onClick={() => {
							if (selected) {
								setOpenIndex(index)
							} else {
								handleTopicSelect(topicId)
							}
						}}
					>
						{topic.topicName}
					</div>
				})}
			</div>
			<Dialog
				title={topics[openIndex]?.topicName}
				onClose={() => setOpenIndex(-1)}
				closeOnMaskClick={true}
				actions={[[{
					key: 'cancel', text: '取消全部', onClick: () => {
						setOpenIndex(-1)
						handleTopicSelect(topics[openIndex]?.id)
					}
				}]]}
				visible={openIndex > -1}
				content={<div className="flex flex-wrap pt-2 gap-2">
					{openIndex > -1 && topics[openIndex]?.categories.map(category => {
						const color = getProgressColor(openIndex, topics.length)
						const categorySelected = option.selectedCategories.includes(category.id)
						return <div style={{
							backgroundColor: !categorySelected ? '' : color,
							color: !categorySelected ? color : '#fff'
						}}
							className={classNames(' bg-neutral-100 dark:bg-neutral-800 text-xs relative py-2 px-4 cursor-pointer rounded-sm')}
							onClick={(e) => {
								handleCategorySelect(category.id)
								e.stopPropagation()
							}}
							key={category.id}>
							{category.categoryName}
						</div>
					})}
				</div>} />
		</div>
	)
}

export default PractiseSelector
