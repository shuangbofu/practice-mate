import { useState, useEffect, useMemo } from 'react'
import PractiseSelector from '../../components/PractiseSelector'
import { useLocalStorageState } from 'ahooks'
import { Options, PracticeItem, Topic } from '../../types'
import axios from 'axios'
import { GithubFilled } from '@ant-design/icons'
import { Button, DotLoading, Picker, Switch, Toast } from 'antd-mobile'
import PracticePage from '../Practise'
import { range, selectRandomNElementsFromArray } from '../../utils/common'
import { useMode } from '../../utils/hook'
import classNames from 'classnames'

const InterviewQuestionBank = () => {
    const [data, setData] = useState<Topic[]>([])
    const [count, setCount] = useState<number>(30)
    const [questionPool, setQuestionPool] = useState<PracticeItem[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const { ref, mode } = useMode()
    const size = mode === 'mobile' ? 'small' : 'middle'
    const [selectedQuestions, setSelectedQuestions] = useState<PracticeItem[]>([])
    const [options, setOptions] = useLocalStorageState<Options>(
        'selectOption', {
        defaultValue: {
            selectedCategories: [],
            selectedTopics: [],
            random: true,
            prac: true
        }
    })
    const maxLength = useMemo(() => selectedQuestions.length, [selectedQuestions])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        document.title = import.meta.env.VITE_TITLE
        try {
            setLoading(true)
            axios.get(import.meta.env.VITE_DATA_URL).then(res => {
                setData(res.data)
                setLoading(false)
            })
        } catch (err) {
            Toast.show(JSON.stringify(err))
        }
    }, [])

    useEffect(() => {
        setSelectedQuestions(data.filter(i => options?.selectedTopics.includes(i.id))
            .flatMap(i => i.categories
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
        const label = ['练习', '学习'][options?.prac ? 0 : 1]
        return (<div className="flex flex-col h-full overflow-hidden bg-gray-100 dark:bg-black">
            <div className='flex-1 min-h-0 h-full'>
                {loading ? <div className='flex justify-center items-center'>
                    <div className={`absolute inset-0 z-10 flex justify-center items-center text-sm lg:text-3xl`}>
                    数据加载中<DotLoading />
                </div>
                </div> : <PractiseSelector
                    topics={data.sort((a, b) => a.priority - b.priority)}
                    value={options || { selectedCategories: [], selectedTopics: [] }}
                    onValueChange={value => setOptions(pre => ({ ...pre, ...value }))}
                />}
            </div>
            <div className='relative py-6 shadow-md bg-white dark:bg-neutral-900
				 dark:text-white flex items-center gap-4 flex-wrap justify-center'>
                <Button size={size} onClick={() => setVisible(true)}>
                    {count}/{maxLength} 题
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
                        '--height': size === 'small' ? '29px' : '38px',
                        '--checked-color': '#00b578'
                    }}
                    checkedText='随机'
                    uncheckedText='顺序'
                    checked={options.random}
                    onChange={random => setOptions(({ ...options, random }))}
                />
                <Switch
                    style={{
                        '--height': size === 'small' ? '29px' : '38px',
                        '--checked-color': options.prac ? '#ff4a58' : '',
                    }}
                    checkedText='练习'
                    uncheckedText='学习'
                    checked={options.prac}
                    onChange={prac => setOptions(({ ...options, prac }))}
                />
                <div className='gap-4 flex items-center'>
                    <Button size={size} color={options.prac ? 'danger' : 'primary'} disabled={disabled} onClick={() => startPractice(count)} >
                        开始{label}
                    </Button>
                    <Button size={size} color={options.prac ? 'danger' : 'primary'} disabled={disabled}
                        onClick={() => startPractice(maxLength)}>{label}全部</Button>
                </div>
                <a className={mode === 'mobile' ? ' absolute right-3 bottom-2.5 ' : ''} onClick={(e) => { e.stopPropagation() }} target='_blank' href={`http://github.com/shuangbofu/practice-mate`}>
                    <GithubFilled className={classNames(' cursor-pointer text-4xl  !text-neutral-600 hover:!text-blue-500',
                        mode === 'mobile' ? '' : ' text-[40px] ml-4'
                    )} />
                </a>
            </div>
        </div >
        )
    }

    return (
        <div ref={ref} className="overflow-hidden h-screen">
            {options && (questionPool.length > 0 ? <PracticePage
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
