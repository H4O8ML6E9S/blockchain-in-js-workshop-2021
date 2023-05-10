import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 2


/*
 * @Author: 南宫
 * @Date: 2023-05-05 21:45:55
 * @LastEditTime: 2023-05-06 22:12:24
 */

class Block {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含
        Block 构造及其函数
    补充 Block 中的函数
    验证区块是否符合挖矿难度要求
    添加更新 Nonce 函数
    添加更新 Hash 函数
    添加 isValid 函数
    掌握并实现区块 Hash 的计算
    区块 Hash 的计算
    统计⽐特币每个区块的挖矿时间及其概率分布(⾄少⼗个区块)并记录
  */
  constructor(blockchain, previousHash, height, timestamp) {
    this.blockchain = blockchain
    this.previousHash = previousHash
    this.height = height
    this.timestamp = timestamp //输出时间戳
    this.hash = this.calculateHash()

  }

  isValid () { }

  setNonce (nonce) { }
  calculateHash () {
    return sha256(this.previousHash, this.timestamp).toString()
  }
}


export default Block

