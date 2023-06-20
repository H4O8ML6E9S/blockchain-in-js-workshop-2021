/*
 * @Author: 南宫
 * @Date: 2023-05-18 18:20:41
 * @LastEditTime: 2023-06-20 17:10:32
 */
import UTXO from './UTXO.js'
class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = utxos; // UTXO映射 accounting -> UTXO(s)
  }

  // 将当前 UXTO 的副本克隆
  clone () {
    return new UTXOPool(JSON.parse(JSON.stringify(this.utxos)))
  }

  // 向 UTXOPool 中添加 UTXO 对象
  addUTXO (publicKey, account, fee = 0) {
    // 先检查 publicKey 对应的 UTXO 是否已存在 Map 中
    if (publicKey in this.utxos) {
      // 如果已存在，直接给该 UTXO 里的 amount 属性添加新的值
      this.utxos[publicKey].account += account;
      this.utxos[publicKey].fee += fee; //这里应该是矿工加todo
      /* 更新total属性 */
      this.utxos[publicKey].amount = this.utxos[publicKey].account + this.utxos[publicKey].fee
    } else {
      // 如果不存在，用新的 UTXO 对象添加到 Map 中
      this.utxos[publicKey] = new UTXO(account, fee);
    }

  }

  // 处理交易，更新 UTXOPool 中的 UTXO 对象
  handleTransaction (transaction) {

    if (!transaction.isValidTransaction()) return false
    let senderPublicKey = transaction.senderPublicKey;
    let amount = transaction.amount;
    let fee = transaction.fee;

    // 检查 senderPublicKey 对应的 UTXO 是否存在
    let senderUTXO = this.utxos[senderPublicKey];
    if (senderPublicKey == '0x000000') {
      senderUTXO = this.utxos[transaction.receiverPublicKey];
    }

    if (senderPublicKey === '0x000000') { //给矿工奖励fee
      // 增加 receiverPublicKey 的UTXO
      let receiverPublicKey = transaction.receiverPublicKey;
      this.addUTXO(receiverPublicKey, 0, fee);
    } else { //正常转账
      if (!(senderPublicKey in this.utxos) || senderUTXO.amount < amount) {
        return false;
      }
      // 更新 senderPublicKey 的UTXO
      senderUTXO.account -= amount;
      senderUTXO.fee -= fee;
      senderUTXO.amount = senderUTXO.account + senderUTXO.fee
      if (senderUTXO.amount === 0) {
        delete this.utxos[senderPublicKey];
      }

      // 增加 receiverPublicKey 的UTXO
      let receiverPublicKey = transaction.receiverPublicKey;
      this.addUTXO(receiverPublicKey, amount, 0);
    }

    return true
  }

  // 验证交易是否合法
  isValidTransaction (transaction) {
    let senderPublicKey = transaction.senderPublicKey
    let amount = transaction.amount

    let utxo = this.utxos[senderPublicKey]
    if (!utxo || utxo.amount < amount) {
      return false
    }
    return true
  }
}
export default UTXOPool
