/*
 * @Author: 南宫
 * @Date: 2023-05-18 18:20:41
 * @LastEditTime: 2023-05-31 23:11:25
 */
import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = utxos; // UTXO映射 accounting -> UTXO(s)
  }

  // 添加交易函数
  /**
   * 将交易的信息更新至 UTXOPool 中
   */
  addUTXO (publicKey, amount) {
    if (this.utxos[publicKey]) {//如果该账户已存在则交易叠加
      this.utxos[publicKey].amount += amount
    } else {
      const u = new UTXO(amount)
      this.utxos[publicKey] = u
    }
  }

  // 将当前 UXTO 的副本克隆
  clone () {
    return new UTXOPool(JSON.parse(JSON.stringify(this.utxos)))
  }

  // 处理交易函数
  handleTransaction (transaction) {
    // 遍历交易中的输入，将对应的 UTXO 删去
    for (let i = 0; i < transaction.inputs.length; i++) {
      const input = transaction.inputs[i]
      const utxoKey = input.previousTxHash + '_' + input.outputIndex
      if (this.utxos[utxoKey]) {
        delete this.utxos[utxoKey]
      } else {
        throw new Error('Error: UTXO not exists')
      }
    }
    // 遍历交易中的输出，将对应的 UTXO 添加进映射表中
    for (let i = 0; i < transaction.outputs.length; i++) {
      const output = transaction.outputs[i]
      const txHash = transaction.hash
      const utxo = new UTXO(txHash, transaction, i)
      this.utxos[txHash + '_' + i] = utxo
    }
  }

  // 验证交易合法性
  /**
   * 验证余额
   * 返回 bool 
   */
  isValidTransaction (transaction) {
    let inputAmount = 0
    let outputAmount = 0
    // 判断每个输入是否是一个未曾被使用的 UTXO，并计算输入金额
    for (let i = 0; i < transaction.inputs.length; i++) {
      const input = transaction.inputs[i]
      const utxoKey = input.previousTxHash + '_' + input.outputIndex
      const utxo = this.utxos[utxoKey]
      if (!utxo) {
        throw new Error('Error: Invalid transaction')
      }
      if (utxo.txOutput.address !== input.address) {
        throw new Error('Error: Invalid transaction')
      }
      inputAmount += utxo.amount
    }
    // 计算输出金额
    for (let i = 0; i < transaction.outputs.length; i++) {
      const output = transaction.outputs[i]
      if (output.amount <= 0) {
        throw new Error('Error: Invalid transaction')
      }
      outputAmount += output.amount
    }
    // 验证交易是否超支
    if (outputAmount > inputAmount) {
      throw new Error('Error: Invalid transaction')
    }
    // 验证通过，返回 true
    return true
  }
}

export default UTXOPool
/* 
import UTXO from './UTXO.js'

class UTXOPool {

  

  handleTransaction(transaction) {
    const sender = this.utxos[transaction.senderPublicKey]
    const receiver = this.utxos[transaction.receiverPublicKey]

    if (sender && receiver && sender.amount >= transaction.amount) {
      sender.amount -= transaction.amount
      receiver.amount += transaction.amount
      this.utxos[transaction.senderPublicKey] = sender
      this.utxos[transaction.receiverPublicKey] = receiver
    }
  }

  isValidTransaction(senderPublicKey, amount) {
    const sender = this.utxos[senderPublicKey]
    return sender && sender.amount >= amount
  }
}

export default UTXOPool

*/