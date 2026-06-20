import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [client, setClient] = useState(null)
  const [activeProject, setActiveProject] = useState(null)
  const [activeVersion, setActiveVersion] = useState(null)

  return (
    <AppContext.Provider value={{
      client, setClient,
      activeProject, setActiveProject,
      activeVersion, setActiveVersion
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
