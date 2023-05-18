/*
 * @Author: 南宫
 * @Date: 2023-05-05 21:45:55
 * @LastEditTime: 2023-05-12 21:26:40
 */
import Block from '../models/Block.js'
import Blockchain from '../models/Blockchain.js'
import sha256 from 'crypto-js/sha256.js'

const main = () => {
  // 初始化区块链
  let blockchain = new Blockchain('BitCoin')

  // 创建创世区块
  let genesisBlock = new Block(blockchain, 'root', 0, 'root')

  // 设置创世区块
  blockchain.genesis = genesisBlock

  // 构建区块
  let newBlock = new Block(
    blockchain,
    genesisBlock.hash,
    1,
    sha256(new Date().getTime().toString()).toString(),
  )
  // console.log();

  // blockchain.blocks[newBlock.hash] = newBlock //老师的
  blockchain.blocks.set(newBlock.hash, newBlock)


  let nextBlock = new Block(
    blockchain,
    newBlock.hash,
    2,
    sha256(new Date().getTime().toString()).toString(),
  )

  let nextCompetitionBlock = new Block(
    blockchain,
    newBlock.hash,
    2,
    sha256((new Date().getTime() + 1).toString()).toString(),
  )

  // 添加两个区块高度为 2  的的竞争区块
  // blockchain.blocks[nextBlock.hash] = nextBlock //老师的
  blockchain.blocks.set(nextBlock.hash, nextBlock)


  // blockchain.blocks[nextCompetitionBlock.hash] = nextCompetitionBlock //老师的
  blockchain.blocks.set(nextCompetitionBlock.hash, nextCompetitionBlock)


  let longestChain = blockchain.longestChain()
  console.log("第一次", longestChain);

  console.assert(longestChain.length == 2, 'Block height should be 2')

  let thirdBlock = new Block(
    blockchain,
    nextCompetitionBlock.hash,
    3,
    sha256(new Date().getTime().toString()).toString(),
  )

  // blockchain.blocks[thirdBlock.hash] = thirdBlock //老师的
  blockchain.blocks.set(thirdBlock.hash, thirdBlock)

  longestChain = blockchain.longestChain()
  console.log("第二次", longestChain);


  // 区块检查
  console.assert(longestChain.length == 3, 'Block height should be 2')
  console.assert(
    longestChain[2].hash == thirdBlock.hash,
    `Height block hash should be ${thirdBlock.hash}`,
  )
  console.log(blockchain);
}

main()
