import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from '../BottomNav'
import CustomTaskModal from '../CustomTaskModal'
import { TasksProvider } from '../../context/TasksContext'
import { AIProvider } from '../../context/AIContext'

const MainLayoutContent = () => {
  const [showAddTask, setShowAddTask] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0C10] pb-28 text-white selection:bg-[#FF8A00]/30">
      <Outlet />
      <BottomNav onOpenAddTask={() => setShowAddTask(true)} />
      <CustomTaskModal isOpen={showAddTask} onClose={() => setShowAddTask(false)} />
    </div>
  )
}

const MainLayout = () => {
  return (
    <TasksProvider>
      <AIProvider>
        <MainLayoutContent />
      </AIProvider>
    </TasksProvider>
  )
}

export default MainLayout
