import request from "@/utils/request";
import {BusinessQuery, BusinessForm} from './types';

export default {
  /**
   * 获取业务分页列表
   *
   * @param queryParams
   */
  listBusinessPages: (queryParams: BusinessQuery) => request({
    url: '/business/getBusinessListVoByPage',
    method: 'GET',
    params: queryParams
  }),

  /**
   * 获取业务表单详情
   *
   * @param businessId
   */
  getBusinessForm: (businessId: number) => request({
    url: '/business/' + businessId,
    method: 'GET'
  }),

  /**
   * 添加业务
   */
  addBusiness: (data: BusinessForm) => request({
    url: '/business/AdminAddBusiness',
    method: 'POST',
    data
  }),

  /**
   * 修改业务
   *
   * @param data
   */
  updateBusiness: (data: BusinessForm) => request({
    url: '/business/updateBusiness',
    method: 'PUT',
    data
  }),

  /**
   * 删除业务
   *
   * @param ids
   */
  deleteBusinessList: (ids: string) => request({
    url: '/business/' + ids,
    method: 'DELETE'
  })
}
