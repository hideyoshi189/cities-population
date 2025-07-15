import { useState, useEffect } from 'react'
import type { PopulationChartProps, ChartDataPoint } from './types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_KEY = '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ'
const API_URL_POPULATION =
  'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear' 

function PopulationChart({ selectedPrefectureCodes, prefectures }: PopulationChartProps) {
  const [populationData, setPopulationData] = useState<ChartDataPoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) 
  const colorList = [
    "#8884d8", 
    "#82ca9d", 
    "#ff7300", 
    "#ff0000", 
    "#0088FE", 
    "#00C49F", 
    "#FFBB28", 
    "#FF8042", 
  ];

  useEffect(() => {
    async function fetchPopulationData() {
      if (selectedPrefectureCodes.length === 0) {
        setPopulationData([]) 
        return
      }

      setIsLoading(true)
      setError(null) 

      try {
        const allData = await Promise.all(
          selectedPrefectureCodes.map(async (code) => {
            const res = await fetch(`${API_URL_POPULATION}?prefCode=${code}&cityCode=-`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY, 
              },
            })

            if (!res.ok) {
              const errorData = await res.json()
              throw new Error(
                `HTTP error! Status: ${res.status} - ${errorData.message || res.statusText}`
              )
            }

            const data = await res.json()
            return {
              prefCode: code,
              label: data.result.data[0].label, 
              values: data.result.data[0].data, 
            }
          })
        )

        const yearMap: { [year: number]: ChartDataPoint } = {}
        allData.forEach(({ prefCode, label, values }) => {
          values.forEach(({ year, value }: { year: number; value: number }) => {
            if (!yearMap[year]) yearMap[year] = { year }
            yearMap[year][label + prefCode] = value 
          })
        })
        const chartData = Object.values(yearMap)

        setPopulationData(chartData)
      } catch (err: unknown) {
        console.error('Failed to fetch population data:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('不明なエラーが発生しました')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopulationData()
  }, [selectedPrefectureCodes]) 

  if (isLoading) {
    return <div>人口データを読み込み中...</div>
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        グラフデータの取得中にエラーが発生しました: {error}
      </div>
    )
  }

  if (selectedPrefectureCodes.length === 0) {
    return <div>都道府県を選択してください。</div>
  }

  if (populationData.length === 0) {
    return <div>選択された都道府県の人口データが見つかりませんでした。</div>
  }

  return (
    <div>
      <h3>選択された都道府県の人口推移グラフ</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={populationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedPrefectureCodes.map((code, idx) => {
            const pref = prefectures.find(p => p.prefCode === code)
            return (
              <Line
                key={code}
                type="monotone"
                dataKey={`総人口${code}`}
                name={pref ? pref.prefName : `都道府県${code}`}
                stroke={colorList[idx % colorList.length]}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PopulationChart
