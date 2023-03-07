import request from "@/utils/request";
import {GoodsQuery} from './types';

export default {
  /**
   * 获取货品分页列表
   *
   * @param queryParams
   */
  listGoodsPages: (queryParams: GoodsQuery) => request({
    url: '/goods/getGoodsListVoByPage',
    method: 'GET',
    params: queryParams
  }),

  /**
   * 获取货品表单详情
   *
   * @param goodsId
   */
  getGoodsForm: (goodsId: number) => request({
    url: '/goods/' + goodsId,
    method: 'GET'
  }),

  /**
   * 添加货品
   */
  addGoods: (data: FormData) => request({
    url: '/goods/AdminAddGoods',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  }),

  /**
   * 修改货品
   *
   * @param data
   */
  updateGoods: (data: FormData) => request({
    url: '/goods',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  }),

  /**
   * 删除货品
   *
   * @param ids
   */
  deleteGoodsList: (ids: string) => request({
    url: '/goods/' + ids,
    method: 'DELETE'
  })
}
