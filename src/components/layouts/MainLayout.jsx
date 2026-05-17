import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from '../BottomNav'
import CustomTaskModal from '../CustomTaskModal'
import ActionSheetModal from '../TodayTasks/ActionSheetModal'
import { TasksProvider } from '../../context/TasksContext'
import { AIProvider } from '../../context/AIContext'
import { TodayTasksProvider } from '../../context/TodayTasksContext'
import { TodayThoughtsProvider } from '../../context/TodayThoughtsContext'

const MainLayoutContent = () => {
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showAddHabit, setShowAddHabit] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0C10] pb-24 text-white selection:bg-[#FF8A00]/30">
      <Outlet />
      <BottomNav onOpenAddTask={() => setShowActionSheet(true)} />
      <ActionSheetModal 
        isOpen={showActionSheet} 
        onClose={() => setShowActionSheet(false)} 
        onOpenAddHabit={() => {
          setShowActionSheet(false);
          setShowAddHabit(true);
        }}
      />
      <CustomTaskModal isOpen={showAddHabit} onClose={() => setShowAddHabit(false)} />
    </div>
  )
}

const MainLayout = () => {
  return (
    <TasksProvider>
      <TodayTasksProvider>
        <TodayThoughtsProvider>
          <AIProvider>
            <MainLayoutContent />
          </AIProvider>
        </TodayThoughtsProvider>
      </TodayTasksProvider>
    </TasksProvider>
  )
}

export default MainLayout
