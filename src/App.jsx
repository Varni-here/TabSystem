import { useState } from 'react'
import TabSystem from './components/TabSystem'
import {
  Option1Component,
  Option2Component,
  Option3Component,
  Option4Component,
  Option5Component
} from './components/OptionComponents'

function App() {
  const [activeTabOption, setActiveTabOption] = useState('option1')

  const tabOptions = [
    { id: 'option1', title: 'Option 1', component: <Option1Component /> ,default:true},
    { id: 'option2', title: 'Option 2', component: <Option2Component /> },
    { id: 'option3', title: 'Option 3', component: <Option3Component /> },
    { id: 'option4', title: 'Option 4', component: <Option4Component /> },
    { id: 'option5', title: 'Option 5', component: <Option5Component /> }
  ]



  return (
    <div className="flex h-screen bg-white font-inter antialiased">
      {/* Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Navigation</h2>
          <div className="space-y-1">
            {tabOptions.map(option => (
              <button 
                key={option.id}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-150"
                onClick={() => setActiveTabOption(option.id)}
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab System */}
      <TabSystem
        tabOptions={tabOptions}
        activeTab={activeTabOption}
        className="flex-1"
      />
    </div>
  )
}

export default App