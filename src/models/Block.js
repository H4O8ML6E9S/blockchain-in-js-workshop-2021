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
    
  */
  constructor(blockchain, previousHash, height, timestamp) {
    this.blockchain = blockchain
    this.previousHash = previousHash
    this.height = height
    this.timestamp = timestamp //输出时间戳
    this.hash = this.calculateHash()

  }

  // 1. 完成构造函数及其参数

  constructor() { }

  isValid () { }

  setNonce (nonce) { }
  calculateHash () {
    return sha256(this.previousHash, this.timestamp).toString()
  }
}


export default Block

