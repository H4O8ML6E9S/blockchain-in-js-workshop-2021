/*
 * @Author: 南宫
 * @Date: 2023-05-05 21:45:55
 * @LastEditTime: 2023-06-01 19:26:12
 */
import sha256 from 'crypto-js/sha256.js'
import UTXO from './UTXO.js'
import UTXOPool from './UTXOPool.js'

export const DIFFICULTY = 2

class Block {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含
    
  */
  constructor(blockchain, previousHash = '', height, timestamp, coinbaseBeneficiary) {
    this.blockchain = blockchain
    this.previousHash = previousHash
    this.height = height
    this.timestamp = timestamp //输出时间戳
    this.hash = this.calculateHash()
    this.nonce = 0
    this.coinbaseBeneficiary = coinbaseBeneficiary //区块奖励接收地址(矿工地址)
    this.utxoPool = new UTXOPool()

    // this.transactions = []
  }

  /* 验证当前区块是否有效 */
  isValid () {
    return (
      this.hash === this.calculateHash() &&
      this.hash.substring(0, DIFFICULTY) === '0'.repeat(DIFFICULTY)
    )
  }

  /* 设置工作量证明的随机数 */
  setNonce (nonce) {
    this.nonce = nonce.toString()
    this.hash = this.calculateHash()
  }

  /* 计算当前区块的hash值
     麻了，这是+号不是逗号，无语住了，找了大半天的bug
  */
  calculateHash () {
    return sha256(this.previousHash + this.timestamp + this.height + this.nonce).toString()
  }
}

export default Block

