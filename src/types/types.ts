// types.ts
export interface ApiParam {
  name: string
  type: string
  required: boolean
  description: string
}

export interface ApiInfo {
  id: number
  name: string
  method: string
  endpoint: string
  description: string
  icon: any
  params: ApiParam[]
  example: string
}
