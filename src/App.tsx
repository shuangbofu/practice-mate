import InterviewQuestionBank from './pages/Home'
import { useDarkMode } from './utils/hook'

function App() {
  useDarkMode()
  return (
    <>
      <InterviewQuestionBank />
    </>
  )
}

export default App
