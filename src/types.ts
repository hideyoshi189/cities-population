export interface Prefecture {
  prefCode: number,
  prefName: string
}

export interface PopulationChartProps {
  selectedPrefectureCodes: number[],
  prefectures: Prefecture[]
}

export interface PrefectureCheckboxesProps {
  onSelectPrefectures: (selectedCodes: number[]) => void
}

export interface PopulationData {
  year: number,
  [prefectureCode: string]: number 
}

export interface ChartDataPoint {
  year: number,
  [key: string]: number | string 
}
