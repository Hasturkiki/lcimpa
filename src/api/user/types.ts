/**
 * 登录用户信息
 */
export interface UserInfo {
  username: string
  isEnabled: boolean
  type: number
  signature: string
}

/**
 * 用户查询参数
 */
export interface UserQuery extends PageQuery {
  keywords: string
  isEnabled: boolean
  type: number
}

/**
 * 用户分页列表项声明
 */
export interface UserType {
  id: number
  username: string
  type: number
  telephone: string
  email: string
  isEnabled: boolean
  createTime: string
}

/**
 * 用户表单类型声明
 */
export interface UserForm {
  id: number | undefined
  username: string
  type: number
  telephone: string
  email: string
  isEnabled: boolean
  createTime: string
}
