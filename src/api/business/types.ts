/**
 * 业务查询参数
 */
export interface BusinessQuery extends PageQuery {
  keywords: string
  upId: number
  companyId: number
  state: number
}

/**
 * 业务分页列表项声明
 */
export interface BusinessType {
  id: number
  upId: number
  upName: string
  companyId: number
  companyName: string
  goodsId: number
  goodsName: string
  brokerage: number
  state: number
  createTime: string
}

/**
 * 业务表单类型声明
 */
export interface BusinessForm extends FormData {
  id: number | undefined
  upId: number
  companyId: number
  goodsId: number
  brokerage: number
  state: number
}
