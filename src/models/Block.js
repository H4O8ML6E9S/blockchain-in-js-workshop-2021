/*
 * @Author: 南宫
 * @Date: 2023-05-05 21:45:55
 * @LastEditTime: 2023-06-18 13:22:42
 */
import sha256 from 'crypto-js/sha256.js'
import UTXOPool from './UTXOPool.js'
import MerkleTree from './MerkleTree.js'
import Transaction from './Transaction.js'
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
  /**
  默克尔树实现
  */
  combinedTransactionsHash () {
    let leaves = this.transactions.map(tx => {
      return sha256(JSON.stringify(tx)).toString()
    })
    let tree = new MerkleTree(leaves)
    this.merkleTree = tree // 保存 Merkle 树对象
    return tree.root.value
  }

  // 添加交易到区块
  /**
  * 需包含 UTXOPool 的更新与 hash 的更新
  * 交易验证包括对交易是否合法的验证和签名验证。
  * 对于 coinbase 交易不进行签名验证，直接通过。
  */
  addTransaction (tx) {
    /* lesson6 */
    // 如果签名不合法则不添加交易
    if (!tx.isValidTransaction() || !tx.hasValidSignature()) return false
    // if (tx.senderPublicKey === this.coinbaseBeneficiary) { // 矿工转账
    if (tx.senderPublicKey === this.coinbaseBeneficiary) { // 矿工转账
      tx.fee = 0
      this.transactions.push(tx)
      this.utxoPool.handleTransaction(tx)
      tx._setHash() // 计算交易哈希值
      this.combinedTransactionsHash() // 更新 Merkle 树
      this._setHash() // 更新区块哈希值
      return true
    } else {
      this.transactions.push(tx)
      this.utxoPool.handleTransaction(tx)
      let temp = new Transaction('0x000000', this.coinbaseBeneficiary, 0, tx.fee)
      this.utxoPool.handleTransaction(temp) // 处理交易 -- 给矿工的
      temp._setHash()
      tx._setHash() // 计算交易哈希值
      this.combinedTransactionsHash() // 更新 Merkle 树
      this._setHash() // 更新区块哈希值
      return true
    }
  }

  /* 判断区块中的交易是否有效 */
  isValidTransaction (transaction) {
    if (transaction.senderPublicKey === this.coinbaseBeneficiary) {
      return true //coinbase交易不需要验证签名
    }
    return transaction.hasValidSignature()
  }
}

export default Block