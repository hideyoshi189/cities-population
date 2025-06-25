// src/PrefectureCheckboxes.jsx
import { useState, useEffect } from 'react'
import { Prefecture, PrefectureCheckboxesProps } from './types'

const API_KEY = '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ'
const API_URL_PREFECTURES =
  'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures' // 都道府県APIエンドポイント

function PrefectureCheckboxes({
  onSelectPrefectures,
}: PrefectureCheckboxesProps) {
  // ★ Propsとしてコールバック関数を受け取る
  const [prefectures, setPrefectures] = useState([])
  const [selectedPrefectures, setSelectedPrefectures] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPrefectures() {
      // ... (前回のPrefectureCheckboxes.jsxのAPIフェッチロジックと同じ)
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
        console.log(data.result) // デバッグ用にレスポンスをログ出力;

        if (Array.isArray(data.result)) {
          setPrefectures(data.result)
        } else {
          throw new Error('API response is not an array of prefectures.')
        }
      } catch (err) {
        console.error('Failed to fetch prefectures:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPrefectures()
  }, [])

  const handleCheckboxChange = (prefectureCode) => {
    setSelectedPrefectures((prevSelected) => {
      let newSelected
      if (prevSelected.includes(prefectureCode)) {
        newSelected = prevSelected.filter((code) => code !== prefectureCode)
      } else {
        newSelected = [...prevSelected, prefectureCode]
      }
      // ★ 選択された都道府県の変更を親コンポーネントに通知
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '10px',
          }}
        >
          {prefectures.map((prefecture) => (
            <label key={prefecture.prefCode} style={{ display: 'block' }}>
              <input
                type="checkbox"
                value={prefecture.prefCode}
                checked={selectedPrefectures.includes(prefecture.prefCode)}
                onChange={() => handleCheckboxChange(prefecture.prefCode)}
              />
              {prefecture.prefName}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default PrefectureCheckboxes
