import { useState, useEffect } from 'react'
import type { Prefecture, PrefectureCheckboxesProps } from './types'
import './prefectureCheckbnoxes.css'

const API_KEY = '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ'
const API_URL_PREFECTURES =
  'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures' 

function PrefectureCheckboxes({
  onSelectPrefectures,
}: PrefectureCheckboxesProps) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPrefectures() {
      try {
        const response = await fetch(API_URL_PREFECTURES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
          },
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            `HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`
          )
        }
        const data = await response.json()
        if (Array.isArray(data.result)) {
          setPrefectures(data.result)
        } else {
          throw new Error('API response is not an array of prefectures.')
        }
      } catch (err: unknown) {
        console.error('Failed to fetch prefectures:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('不明なエラーが発生しました')
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchPrefectures()
  }, [])

  const handleCheckboxChange = (prefectureCode: number) => {
    setSelectedPrefectures((prevSelected) => {
      let newSelected: number[]
      if (prevSelected.includes(prefectureCode)) {
        newSelected = prevSelected.filter((code) => code !== prefectureCode)
      } else {
        newSelected = [...prevSelected, prefectureCode]
      }
      onSelectPrefectures(newSelected)
      return newSelected
    })
  }

  if (isLoading) return <div>都道府県データを読み込み中...</div>
  if (error)
    return <div style={{ color: 'red' }}>エラーが発生しました: {error}</div>

  return (
    <div>
      <h2>都道府県を選択</h2>
      {prefectures.length === 0 ? (
        <p>都道府県データが見つかりませんでした。</p>
      ) : (
        <div className="prefecture-checkboxes-grid">
          {prefectures.map((prefecture) => (
            <label 
              key={prefecture.prefCode} 
              className="prefecture-checkbox-label"
            >
              <input
                type="checkbox"
                value={prefecture.prefCode}
                checked={selectedPrefectures.includes(prefecture.prefCode)}
                onChange={() => handleCheckboxChange(prefecture.prefCode)}
                className="prefecture-checkbox-input"
              />
              <span>{prefecture.prefName}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default PrefectureCheckboxes
