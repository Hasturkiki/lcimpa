/**
 * 货品查询参数
 */
export interface GoodsQuery extends PageQuery {
  keywords: string
  ownerId: number
}

/**
 * 货品分页列表项声明
 */
export interface GoodsType {
  id: number
  goodsName: string
  description: string
  ownerId: number
  ownerName: string
  brokerage: number
  mainImageOriginalNames: string[]
  mainImagePositions: string[]
  mainImageIDs: number[]
  detailImageOriginalNames: string[]
  detailImagePositions: string[]
  detailImageIDs: number[]
  createTime: string
}

/**
 * 货品表单类型声明
 */
export interface GoodsForm {
  id: number | undefined
  goodsName: string
  description: string
  ownerId: number
  ownerName: string
  brokerage: number
}
