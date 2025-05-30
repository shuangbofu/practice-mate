import { useState, useEffect, useMemo } from 'react'
import PractiseSelector from '../../components/PractiseSelector'
import { useLocalStorageState } from 'ahooks'
import { Options, PracticeItem, Topic } from '../../types'
import axios from 'axios'
import { GithubFilled } from '@ant-design/icons'
import { Button, Picker, Switch } from 'antd-mobile'
import PracticePage from '../Practise'
import { range } from '../../utils/common'

const arr = ['练习', '学习']
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
    const [visible, setVisible] = useState<boolean>(false)

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
    const [options, setOptions] = useLocalStorageState<Options>(
        'selectOption',
        {
            defaultValue: {
                selectedCategories: [],
                selectedTopics: [],
                random: true,
                prac: true
            }
        }
    )
    const maxLength = useMemo(() => selectedQuestions.length, [selectedQuestions])

    useEffect(() => {
        setSelectedQuestions(
            data.filter(i => options?.selectedTopics.includes(i.id))
                .flatMap(i =>
                    i.categories
                        .filter(j => options?.selectedCategories.includes(j.id))
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
    }, [options, data])

    useEffect(() => {
        if (count > maxLength && maxLength > 0) {
            setCount(maxLength)
        }
    }, [selectedQuestions])

    const getQuestions = (cnt: number) => {
        cnt = cnt < maxLength ? cnt : maxLength
        console.log(cnt)
        return options?.random
            ? selectRandomNElementsFromArray(selectedQuestions, cnt)
            : selectedQuestions.slice(0, cnt)
    }

    const startPractice = (count: number) => setQuestionPool(getQuestions(count))

    const renderWelcome = (options: Options) => {
        const disabled = maxLength === 0
        const label = arr[options?.prac ? 0 : 1]
        return (
            <div className="flex flex-col h-full overflow-hidden bg-gray-100 dark:bg-black">
                <PractiseSelector
                    style={{ flex: 1, overflow: 'auto' }}
                    topics={data.sort((a, b) => a.priority - b.priority)}
                    value={options || { selectedCategories: [], selectedTopics: [] }}
                    onValueChange={value => setOptions(pre => ({ ...pre, ...value }))}
                />
                <div className='p-2 shadow-md bg-white dark:bg-zinc-800
				 dark:text-white flex items-center gap-4 flex-wrap justify-center'
                    style={{ flex: '0 0 auto' }}>
                    {/* <InputNumber
                        showMax={true}
                        _size='small'
                        disabled={disabled}
                        min={10}
                        max={maxLength}
                        value={count}
                        onValueChange={setCount}
                    /> */}
                    <Button
                        onClick={() => {
                            setVisible(true)
                        }}
                    >
                        {count}/{maxLength}
                    </Button>
                    <Picker
                        columns={[range(10, maxLength).map(i => ({ value: i, label: i }))]}
                        visible={visible}
                        onClose={() => {
                            setVisible(false)
                        }}
                        value={[count]}
                        onConfirm={v => {
                            // @ts-ignore
                            setCount(v[0])
                        }}
                    />
                    <Switch
                        style={{
                            '--checked-color': '#00b578'
                        }}
                        checkedText='随机'
                        uncheckedText='顺序'
                        checked={options.random}
                        onChange={random => setOptions(({ ...options, random }))}
                    />
                    <Switch
                        style={{
                            '--checked-color': options.prac ? '#ff4a58' : '',
                        }}
                        checkedText='练习'
                        uncheckedText='学习'
                        checked={options.prac}
                        onChange={prac => setOptions(({ ...options, prac }))}
                    />
                    <Button color={options.prac ? 'danger' : 'primary'} disabled={disabled} onClick={() => startPractice(count)} >
                        开始{label}
                    </Button>
                    <Button color={options.prac ? 'danger' : 'primary'} disabled={disabled}
                        onClick={() => startPractice(maxLength)}>{label}全部</Button>
                    <a onClick={(e) => { e.stopPropagation() }} target='_blank' href={`http://github.com/shuangbofu/practice-mate`}>
                        <GithubFilled className=' cursor-pointer absolute right-2 bottom-2.5 text-4xl !text-neutral-600' />
                    </a>
                </div>
            </div >
        )
    }

    return (
        <div className="overflow-hidden h-screen">
            {options && (questionPool.length > 0 ?
                <PracticePage
                    back={() => {
                        setQuestionPool([])
                        setCount(30)
                    }}
                    refresh={(options.random || false) &&
                        selectedQuestions.length > questionPool.length
                        && (() => startPractice(count))}
                    prac={options.prac || false}
                    questionPool={questionPool}
                /> : renderWelcome(options))}
        </div>
    )
}

export default InterviewQuestionBank
