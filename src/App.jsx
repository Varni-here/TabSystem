import { useState, useEffect } from 'react'

function App() {
  const [tabs, setTabs] = useState([{ id: 'tab-1', optionId: 'option1', title: 'Option 1', active: true, splitWith: null }])
  const [activeTab, setActiveTab] = useState('tab-1')
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [tabCounter, setTabCounter] = useState(2)

  const sidebarOptions = [
    { id: 'option1', title: 'Option 1' },
    { id: 'option2', title: 'Option 2' },
    { id: 'option3', title: 'Option 3' },
    { id: 'option4', title: 'Option 4' },
    { id: 'option5', title: 'Option 5' }
  ]

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.split-dropdown')) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSidebarClick = (option) => {
    // Only activate existing tab if it's in single mode (not split)
    const existingTab = tabs.find(tab => tab.optionId === option.id && !tab.splitWith)
    
    if (existingTab) {
      setActiveTab(existingTab.id)
    } else {
      // Always create new tab with unique ID if no single-mode tab exists
      const newTabId = `tab-${tabCounter}`
      const newTab = { id: newTabId, optionId: option.id, title: option.title, active: false, splitWith: null }
      setTabs(prev => prev.map(tab => ({ ...tab, active: false })).concat(newTab))
      setActiveTab(newTabId)
      setTabCounter(prev => prev + 1)
    }
  }

  const closeTab = (tabId) => {
    const updatedTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(updatedTabs)
    
    if (activeTab === tabId && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[updatedTabs.length - 1].id)
    }
  }

  const switchTab = (tabId) => {
    setActiveTab(tabId)
  }

  const handleSplitClick = (tabId, e) => {
    e.stopPropagation()
    setDropdownOpen(dropdownOpen === tabId ? null : tabId)
  }

  const handleSplitOption = (currentTabId, splitOptionId) => {
    // Simply update the current tab to include split - don't remove other tabs
    const finalTabs = tabs.map(tab => 
      tab.id === currentTabId 
        ? { ...tab, splitWith: splitOptionId }
        : tab
    )
    
    setTabs(finalTabs)
    setDropdownOpen(null)
  }

  const closeSplitPanel = (tabId) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, splitWith: null }
        : tab
    ))
  }

  const getAvailableOptions = (currentTabId) => {
    const currentTab = tabs.find(tab => tab.id === currentTabId)
    // Show all options except the current tab's main option
    return sidebarOptions.filter(option => 
      option.id !== currentTab?.optionId
    )
  }

  return (
    <div className="flex h-screen bg-white font-inter antialiased">
      {/* Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Navigation</h2>
          <div className="space-y-1">
            {sidebarOptions.map(option => (
              <button 
                key={option.id}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-150"
                onClick={() => handleSidebarClick(option)}
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {tabs.length > 0 && (
          <>
            {/* Tab Bar */}
            <div className="flex bg-white border-b border-slate-200">
              {tabs.map(tab => (
                <div 
                  key={tab.id}
                  className={`group flex items-center px-4 py-3 cursor-pointer transition-all duration-150 min-w-[160px] max-w-[280px] border-b-2 ${
                    activeTab === tab.id 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                  onClick={() => switchTab(tab.id)}
                >
                  <span className="flex-1 text-sm font-medium text-slate-700 truncate mr-3">
                    {tab.splitWith ? `${tab.title} • ${sidebarOptions.find(opt => opt.id === tab.splitWith)?.title}` : tab.title}
                  </span>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {/* Split Button */}
                    <div className="relative split-dropdown">
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors duration-150"
                        onClick={(e) => handleSplitClick(tab.id, e)}
                        title="Split view"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v16m6-16v16M4 8h16M4 16h16" />
                        </svg>
                      </button>
                      {dropdownOpen === tab.id && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
                          {getAvailableOptions(tab.id).map(option => (
                            <button 
                              key={option.id}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                              onClick={() => handleSplitOption(tab.id, option.id)}
                            >
                              {option.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Close Button */}
                    <button 
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors duration-150"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTab(tab.id)
                      }}
                      title="Close tab"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Content Area */}
            <div className="flex-1 relative bg-white">
              {tabs.map(tab => (
                <div 
                  key={tab.id}
                  className={`${activeTab === tab.id ? 'block' : 'hidden'} h-full`}
                >
                  {tab.splitWith ? (
                    <div className="flex flex-col h-full">
                      {/* Sub-tab Headers */}
                      <div className="flex bg-slate-50 border-b border-slate-200">
                        <div className="flex-1 flex items-center justify-between px-4 py-2.5 bg-white border-r border-slate-200">
                          <span className="text-sm font-medium text-slate-700">{tab.title}</span>
                          <button 
                            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors duration-150"
                            onClick={() => closeSplitPanel(tab.id)}
                            title="Close split"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 flex items-center justify-between px-4 py-2.5 bg-slate-50">
                          <span className="text-sm font-medium text-slate-700">{sidebarOptions.find(opt => opt.id === tab.splitWith)?.title}</span>
                          <button 
                            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors duration-150"
                            onClick={() => closeSplitPanel(tab.id)}
                            title="Close split"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Split Content */}
                      <div className="flex flex-1">
                        <div className="flex-1 p-8 overflow-auto">
                          <div className="max-w-4xl">
                            <h1 className="text-2xl font-bold text-slate-900 mb-4">{tab.title}</h1>
                            <div className="prose prose-slate max-w-none">
                              <p className="text-slate-600 leading-relaxed">
                                This is the content area for {tab.title}. Here you can add any content, components, or functionality specific to this section.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-px bg-slate-200"></div>
                        <div className="flex-1 p-8 overflow-auto">
                          <div className="max-w-4xl">
                            <h1 className="text-2xl font-bold text-slate-900 mb-4">{sidebarOptions.find(opt => opt.id === tab.splitWith)?.title}</h1>
                            <div className="prose prose-slate max-w-none">
                              <p className="text-slate-600 leading-relaxed">
                                This is the content area for {sidebarOptions.find(opt => opt.id === tab.splitWith)?.title}. Here you can add any content, components, or functionality specific to this section.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 h-full overflow-auto">
                      <div className="max-w-4xl">
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">{tab.title}</h1>
                        <div className="prose prose-slate max-w-none">
                          <p className="text-slate-600 leading-relaxed">
                            This is the content area for {tab.title}. Here you can add any content, components, or functionality specific to this section.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App