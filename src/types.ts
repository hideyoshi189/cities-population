export interface Prefecture {
  prefCode: number,
  preName: string
}

export interface PopulationChartProps {
  SelectionedPrefectureCodes: number[]
}

export interface PrefectureCheckboxesProps {
  onSelectPrefectures: (selectedCodes: number[]) => void

}

export interface PopulationData {
  year: number,
  [prefectureCode: string]: number // 都道府県コードをキーとする人口データ
}

export interface 