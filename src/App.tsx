// src/App.jsx (親コンポーネント)
import { useState } from 'react'
import PrefectureCheckboxes from './prefectureCheckbnoxes'
import PopulationChart from './chart'

function App() {
  // 親コンポーネントで選択された都道府県のコードを管理するstate
  const [selectedPrefectureCodes, setSelectedPrefectureCodes] = useState([])

  // PrefectureCheckboxes から選択情報を受け取るコールバック関数
  const handlePrefectureSelection = (newSelectedCodes) => {
    setSelectedPrefectureCodes(newSelectedCodes)
    console.log('App.jsx: Selected Prefectures updated:', newSelectedCodes)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>都道府県別人口推移</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div
          style={{
            flex: 1,
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '8px',
          }}
        >
          {/* PrefectureCheckboxes に選択時のコールバック関数を渡す */}
          <PrefectureCheckboxes
            onSelectPrefectures={handlePrefectureSelection}
          />
        </div>
        <div
          style={{
            flex: 2,
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '8px',
          }}
        >
          {/* PopulationChart に選択された都道府県コードを渡す */}
          <PopulationChart selectedPrefectureCodes={selectedPrefectureCodes} />
        </div>
      </div>
    </div>
  )
}

export default App
