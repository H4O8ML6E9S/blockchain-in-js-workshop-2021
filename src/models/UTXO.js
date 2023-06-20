/*
 * @Author: 南宫
 * @Date: 2023-05-18 18:20:41
 * @LastEditTime: 2023-06-20 16:52:15
 */
export default class UTXO {
  constructor(account, fee = 0) {
    this.fee = fee // 手续费
    this.account = account // 
    this.amount = account + fee // 总的
  }
}