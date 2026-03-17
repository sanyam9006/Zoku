'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type CityContextType = {
  city: string
  setCity: (city: string) => void
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState('Bangalore')

  useEffect(() => {
    const savedCity = localStorage.getItem('zoku-city')
    if (savedCity) setCityState(savedCity)
  }, [])

  const setCity = (newCity: string) => {
    setCityState(newCity)
    localStorage.setItem('zoku-city', newCity)
  }

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const context = useContext(CityContext)
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider')
  }
  return context
}
