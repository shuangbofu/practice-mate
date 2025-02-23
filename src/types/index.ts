// 定义接口类型
export interface Topic {
	id: number
	topicName: string
	priority: number
	categories: Category[]
}

export interface Category {
	id: number
	categoryName: string
	questions: QuestionItem[]
}

export interface QuestionItem {
	id: number
	question: string
	answer: string // 假设答案是HTML字符串
}


export interface SelectOption {
	selectedTopics: number[]
	selectedCategories: number[]
}

export interface PracticeItem extends QuestionItem {
	categoryId: number
	topicId: number
	categoryName: string
	topicName: string
}

export type PractiseMode = 'learn' | 'practise'