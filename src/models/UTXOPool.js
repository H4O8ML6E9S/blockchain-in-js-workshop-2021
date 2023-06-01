/*
 * @Author: 南宫
 * @Date: 2023-05-18 18:20:41
 * @LastEditTime: 2023-06-01 19:39:55
 */
import UTXO from './UTXO.js'
import sha256 from 'crypto-js/sha256.js'
class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = utxos; // UTXO映射 accounting -> UTXO(s)
  }

  // 添加交易函数
  /**
   * 将交易的信息更新至 UTXOPool 中
   */
  addUTXO (publicKey, amount) {
    // 先检查 publicKey 对应的 UTXO 是否已存在 Map 中
    if (publicKey in this.utxos) {
      // 如果已存在，直接给该 UTXO 里的 amount 属性添加新的值
      this.utxos[publicKey].amount += amount
    } else {
      // 如果不存在，用新的 UTXO 对象添加到 Map 中
      this.utxos[publicKey] = new UTXO(amount)
    }
  }

  // 将当前 UXTO 的副本克隆
  clone () {
    return new UTXOPool(JSON.parse(JSON.stringify(this.utxos)))
  }

  // 处理交易函数
  handleTransaction (transaction) {
    let senderPublicKey = transaction.senderPublicKey
    let amount = transaction.amount

    // 检查 senderPublicKey 对应的 UTXO 是否存在
    let senderUTXO = this.utxos[senderPublicKey]
    if (!(senderPublicKey in this.utxos) || senderUTXO.amount < amount) {
      // throw new Error("Transaction is invalid! No enough UTXO!");
      return false
    }

    // 更新 senderPublicKey 的UTXO
    senderUTXO.amount -= amount;
    if (senderUTXO.amount === 0) {
      delete this.utxos[senderPublicKey];
    }

    // 增加 receiverPublicKey 的UTXO
    let receiverPublicKey = transaction.receiverPublicKey;
    this.addUTXO(receiverPublicKey, amount);
  }

  // 验证交易合法性
  /**
   * 验证余额
   * 返回 bool 
   */
  isValidTransaction (senderPublicKey, amount) {
    let utxo = this.utxos[senderPublicKey];
    if (!utxo || utxo.amount < amount) {
      return false;
    }
    return true;
  }
}
export default UTXOPool
