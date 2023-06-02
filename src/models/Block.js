/*
 * @Author: 南宫
 * @Date: 2023-05-05 21:45:55
 * @LastEditTime: 2023-06-02 19:58:04
 */
import sha256 from 'crypto-js/sha256.js'
import UTXOPool from './UTXOPool.js'
import MerkleTree from './MerkleTree.js'
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
    // this.merkleTree = new MerkleTree()
    this.merkleTree = null
    this.transactions = []
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
  // 根据交易变化更新区块 hash
  _setHash () {
    this.hash = this.calculateHash();
  }

  // 汇总计算交易的 Hash 值
  combinedTransactionsHash () {
    const transactionsHashes = this.transactions.map(tx => tx.hash)
    this.merkleTree = new MerkleTree(transactionsHashes)
    const merkleRoot = this.merkleTree.getRootHash()
    return merkleRoot
  }

  // 添加交易到区块
  addTransaction (transaction) {
    if (!transaction.isValidTransaction()) return

    // 处理交易
    this.utxoPool.handleTransaction(transaction)

    // 添加交易到 transactions 数组
    this.transactions.push(transaction)

    // 计算交易 hash
    transaction._setHash()

    // 更新区块的 hash 和 merkleTree
    this.combinedTransactionsHash()
    this._setHash()

  }
}

export default Block
