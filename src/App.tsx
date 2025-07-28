import { useState, useEffect } from 'react'
import PrefectureCheckboxes from './prefectureCheckbnoxes'
import PopulationChart from './chart'
import type { Prefecture } from './types'
import './App.css'

function App() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [selectedPrefectureCodes, setSelectedPrefectureCodes] = useState<number[]>([])

  useEffect(() => {
    fetch('https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures', {
      headers: { 'X-API-KEY': import.meta.env.VITE_API_KEY }
    })
      .then(res => res.json())
      .then(data => setPrefectures(data.result))
  }, [])

  return (
    <div className="app-container">
      <h1 className="app-title">都道府県別人口推移</h1>
      <div className="app-content">
        <div className="checkboxes-container">
          <PrefectureCheckboxes
            onSelectPrefectures={setSelectedPrefectureCodes}
          />
        </div>
        <div className="chart-container">
          <PopulationChart
            selectedPrefectureCodes={selectedPrefectureCodes}
            prefectures={prefectures}
          />
        </div>
      </div>
    </div>
  )
}

export default App
