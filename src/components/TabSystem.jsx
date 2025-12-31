import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

const TabSystem = forwardRef(({ 
  tabOptions = [], 
  className = "",
  activeTab: externalActiveTab = null
}, ref) => {
  const [tabs, setTabs] = useState(() => {
    if (tabOptions.length > 0) {
      const defaultOption = tabOptions.find(opt => opt.default === true) || tabOptions[0]
      return [{ id: 'tab-1', optionId: defaultOption.id, title: defaultOption.title, active: true, splitWith: null, splitRatio: 50 }]
    }
    return []
  })
  const [activeTab, setActiveTab] = useState('tab-1')
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [tabCounter, setTabCounter] = useState(2)
  const [isDragging, setIsDragging] = useState(false)
  const [dragTabId, setDragTabId] = useState(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.split-dropdown')) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const openTab = (optionId) => {
    const option = tabOptions.find(opt => opt.id === optionId)
    if (!option) return

    // Check for existing single tab first
    const existingSingleTab = tabs.find(tab => tab.optionId === optionId && !tab.splitWith)
    
    if (existingSingleTab) {
      setActiveTab(existingSingleTab.id)
      return
    }

    // Check for existing split tab (either as main or split option)
    const existingSplitTab = tabs.find(tab => 
      (tab.optionId === optionId && tab.splitWith) || 
      (tab.splitWith === optionId)
    )
    
    if (existingSplitTab) {
      setActiveTab(existingSplitTab.id)
      return
    }

    // Create new tab if none exists
    const newTabId = `tab-${tabCounter}`
    const newTab = { id: newTabId, optionId: option.id, title: option.title, active: false, splitWith: null, splitRatio: 50 }
    setTabs(prev => prev.map(tab => ({ ...tab, active: false })).concat(newTab))
    setActiveTab(newTabId)
    setTabCounter(prev => prev + 1)
  }

  // Handle external activeTab changes
  useEffect(() => {
    if (externalActiveTab) {
      openTab(externalActiveTab)
    }
  }, [externalActiveTab])

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
    const updatedTabs = tabs.filter(tab => !(tab.optionId === splitOptionId && !tab.splitWith))
    
    const finalTabs = updatedTabs.map(tab => 
      tab.id === currentTabId 
        ? { ...tab, splitWith: splitOptionId, splitRatio: 50 }
        : tab
    )
    
    setTabs(finalTabs)
    setDropdownOpen(null)
  }

  const closeSplitPanel = (tabId) => {
    const currentTab = tabs.find(tab => tab.id === tabId)
    if (!currentTab || !currentTab.splitWith) return
    
    const newTabId = `tab-${tabCounter}`
    const mainTab = { ...currentTab, splitWith: null, splitRatio: 50 }
    const splitOption = tabOptions.find(opt => opt.id === currentTab.splitWith)
    const splitTab = { 
      id: newTabId, 
      optionId: currentTab.splitWith, 
      title: splitOption?.title || 'Unknown',
      active: false, 
      splitWith: null, 
      splitRatio: 50 
    }
    
    const updatedTabs = tabs.map(tab => 
      tab.id === tabId ? mainTab : tab
    ).concat(splitTab)
    
    setTabs(updatedTabs)
    setTabCounter(prev => prev + 1)
  }

  const handleMouseDown = (tabId, e) => {
    e.preventDefault()
    setIsDragging(true)
    setDragTabId(tabId)
  }

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragTabId) return
    
    const container = document.querySelector('.split-container')
    if (!container) return
    
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(10, Math.min(90, (x / rect.width) * 100))
    
    setTabs(prev => prev.map(tab => 
      tab.id === dragTabId 
        ? { ...tab, splitRatio: percentage }
        : tab
    ))
  }, [isDragging, dragTabId])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragTabId(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      const handleMove = (e) => handleMouseMove(e)
      const handleUp = () => handleMouseUp()
      
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const getAvailableOptions = (currentTabId) => {
    const currentTab = tabs.find(tab => tab.id === currentTabId)
    return tabs
      .filter(tab => tab.id !== currentTabId && !tab.splitWith)
      .map(tab => tabOptions.find(opt => opt.id === tab.optionId))
      .filter(Boolean)
  }

  if (tabs.length === 0) {
    return (
      <div className={`flex flex-col h-full w-full ${className}`}>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No tabs open
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full w-full ${className}`}>
      <div className="flex bg-gray-100 border-b border-gray-200">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`group relative flex items-center px-4 py-3 cursor-pointer transition-all duration-200 min-w-[160px] max-w-[280px] mr-1 rounded-t-lg border-t-2 ${
              activeTab === tab.id 
                ? 'bg-white border-blue-500 shadow-sm -mb-px z-10' 
                : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-300'
            }`}
            onClick={() => switchTab(tab.id)}
          >
            <span className="flex-1 text-sm font-medium text-gray-700 truncate mr-3">
              {tab.splitWith ? `${tab.title} • ${tabOptions.find(opt => opt.id === tab.splitWith)?.title}` : tab.title}
            </span>
            
            {!tab.splitWith && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="relative split-dropdown">
                  <button 
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-150"
                    onClick={(e) => handleSplitClick(tab.id, e)}
                    title="Split view"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v16m6-16v16M4 8h16M4 16h16" />
                    </svg>
                  </button>
                  {dropdownOpen === tab.id && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
                      {getAvailableOptions(tab.id).map(option => (
                        <button 
                          key={option.id}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          onClick={() => handleSplitOption(tab.id, option.id)}
                        >
                          {option.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                  title="Close tab"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {tab.splitWith && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  className="w-6 h-6 flex items-center justify-center text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeSplitPanel(tab.id)
                  }}
                  title="Separate to individual tabs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex-1 relative bg-white">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`${activeTab === tab.id ? 'block' : 'hidden'} h-full`}
          >
            {tab.splitWith ? (
              <div className="flex flex-col h-full">
                <div className="flex bg-gray-50 border-b border-gray-200">
                  <div 
                    className="group flex items-center justify-between px-4 py-3 bg-white border-r border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                    style={{ width: `${tab.splitRatio}%` }}
                  >
                    <span className="text-sm font-medium text-gray-700">{tab.title}</span>
                    <button 
                      className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 opacity-0 group-hover:opacity-100"
                      onClick={() => closeSplitPanel(tab.id)}
                      title="Close this panel"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="w-2 bg-gray-200 flex-shrink-0 hover:bg-gray-300 transition-colors duration-150"></div>
                  <div 
                    className="group flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                    style={{ width: `${100 - tab.splitRatio}%` }}
                  >
                    <span className="text-sm font-medium text-gray-700">{tabOptions.find(opt => opt.id === tab.splitWith)?.title}</span>
                    <button 
                      className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 opacity-0 group-hover:opacity-100"
                      onClick={() => closeSplitPanel(tab.id)}
                      title="Close this panel"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-1 split-container">
                  <div 
                    className="overflow-auto"
                    style={{ width: `${tab.splitRatio}%` }}
                  >
                    {tabOptions.find(opt => opt.id === tab.optionId)?.component || (
                      <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{tab.title}</h1>
                        <p className="text-gray-600">Content for {tab.title}</p>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="w-2 bg-gray-200 hover:bg-blue-300 cursor-col-resize flex-shrink-0 relative group transition-colors duration-150"
                    onMouseDown={(e) => handleMouseDown(tab.id, e)}
                  >
                    <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-200 transition-colors duration-150 opacity-50"></div>
                  </div>
                  
                  <div 
                    className="overflow-auto"
                    style={{ width: `${100 - tab.splitRatio}%` }}
                  >
                    {tabOptions.find(opt => opt.id === tab.splitWith)?.component || (
                      <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{tabOptions.find(opt => opt.id === tab.splitWith)?.title}</h1>
                        <p className="text-gray-600">Content for {tabOptions.find(opt => opt.id === tab.splitWith)?.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              tabOptions.find(opt => opt.id === tab.optionId)?.component || (
                <div className="p-8 h-full overflow-auto">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{tab.title}</h1>
                  <p className="text-gray-600">Content for {tab.title}</p>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

export default TabSystem