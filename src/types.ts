export type ESDocument = {
  _index: string
  _type: string
  _id: string
  _score: number,
  _source: object
}

export  type QueryResults = ESDocument[];

export  type SearchParam = {
  index: string
  size?: number
  body: object | string
  scroll?: string
}