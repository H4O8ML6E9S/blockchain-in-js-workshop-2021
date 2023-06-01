/*
 * @Author: 南宫
 * @Date: 2023-05-21 11:03:37
 * @LastEditTime: 2023-05-31 23:01:21
 */
import sha256 from 'crypto-js/sha256.js'

class Transaction {
  constructor(senderPublicKey, receiverPublicKey, amount) {
    this.senderPublicKey = senderPublicKey
    this.receiverPublicKey = receiverPublicKey
    this.amount = amount
    this.timestamp = new Date().getTime()
    this.hash = this._calculateHash()
  }

  // 更新交易 hash
  _setHash () {
    this.hash = this._calculateHash()
  }

  // 计算交易 hash 的摘要函数
  _calculateHash () {
    return sha256(this.senderPublicKey + this.receiverPublicKey + this.amount + this.timestamp).toString()
  }
}

export default Transaction
