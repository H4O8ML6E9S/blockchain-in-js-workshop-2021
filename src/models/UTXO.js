/*
 * @Author: 南宫
 * @Date: 2023-05-18 18:20:41
 * @LastEditTime: 2023-06-11 10:33:16
 */
export default class UTXO {
  constructor(amount, fee = 0) {
    this.amount = amount
    this.fee = fee
  }
}
