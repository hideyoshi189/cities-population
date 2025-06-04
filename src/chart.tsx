// src/PopulationChart.jsx (または DataVisualization.jsx)
import { useState, useEffect } from 'react'
// グラフライブラリをインポート（例: Recharts, Chart.js, Nivoなど）
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_KEY = '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ'
// ★★★ 人口構成データを取得するAPIのエンドポイント。例:
// https://example.com/api/population?prefCode=1&prefCode=13&cityCode=-
const API_URL_POPULATION =
  'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear' // ★★★ ここを実際の人口データAPIに置き換えてください

// 選択された都道府県のコードをPropsとして受け取る
function PopulationChart({ selectedPrefectureCodes }) {
  const [populationData, setPopulationData] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false) // 初期はロード中でない

  // selectedPrefectureCodes が変更されるたびにデータをフェッチ
  useEffect(() => {
    async function fetchPopulationData() {
      // 選択された都道府県がない場合は何もしない
      if (selectedPrefectureCodes.length === 0) {
        setPopulationData([]) // データをクリア
        return
      }

      setIsLoading(true)
      setError(null) // エラーをリセット

      try {
        // パラメータを構築
        // APIの仕様に合わせて、どのように複数のprefCodeを渡すか確認してください。
        // 例: ?prefCode=1&prefCode=2 の形式や ?prefCodes=1,2 の形式など
        const params = new URLSearchParams()
        selectedPrefectureCodes.forEach((code) =>
          params.append('prefCode', code)
        )
        // 市区町村コードの指定が必要な場合（例: 全国データなら '-'):
        params.append('cityCode', '-') // ★★★ APIの仕様に合わせてcityCodeを設定

        const fullUrl = `${API_URL_POPULATION}?${params.toString()}`

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY, // APIキーをヘッダーに含める
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            `HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`
          )
        }

        const data = await response.json()
        // ★★★ APIレスポンスの形式に合わせて、グラフ描画に適した形にデータを整形
        // 例: { year: 2000, 北海道: 1000000, 東京都: 5000000 }, ... のような形式
        // ここでは仮にそのままセットするとします。実際のAPIレスポンスに合わせて調整してください。
        // data.result.data; // RESAS APIの場合など、実際のパスを確認
        setPopulationData(data.result.data) // 例：RESAS APIの人口構成データの場合
      } catch (err) {
        console.error('Failed to fetch population data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopulationData()
  }, [selectedPrefectureCodes]) // ★ selectedPrefectureCodes が変更されたときに再実行

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

  // ★★★ ここにグラフのレンダリングロジックを記述します
  // 使用するグラフライブラリ（例: Recharts, Chart.js）のコンポーネントを配置
  return (
    <div>
      <h3>選択された都道府県の人口推移グラフ</h3>
      {/* グラフコンポーネントをここに配置 */}
      {/* <ResponsiveContainer width="100%" height={400}>
        <LineChart data={populationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" /> // 例えば年データを表示
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedPrefectureCodes.map(code => (
             // ここで各都道府県のラインを描画。APIのデータ形式による。
             // 例: populationDataが { year: YYYY, pref1: VAL1, pref2: VAL2 } の場合
             <Line key={code} type="monotone" dataKey={`pref${code}`} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </LineChart>
      </ResponsiveContainer> */}
      <pre>
        {/* 取得したデータ形式の確認用 */}
        {JSON.stringify(populationData, null, 2)}
      </pre>
    </div>
  )
}

export default PopulationChart
