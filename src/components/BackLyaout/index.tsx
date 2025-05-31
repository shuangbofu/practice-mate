import { NavBar } from 'antd-mobile'
import { ReactNode } from 'react'

interface BackLayoutProps {
  title?: string | ReactNode
  children: ReactNode
  backArrow?: boolean
  back: () => void
}

const BackLayout = ({ title = '返回', backArrow = true, children, back }: BackLayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar back={backArrow ? '返回' : null} onBack={back}>
        {title}
      </NavBar>
      <div className="flex-1 overflow-auto min-h-0">
        {children}
      </div>
    </div>
  )
}

export default BackLayout