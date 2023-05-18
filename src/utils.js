/*
 * @Author: 南宫
 * @Date: 2023-05-10 21:24:47
 * @LastEditTime: 2023-05-18 16:58:15
 */
import sha256 from 'crypto-js/sha256.js'

export const validateHash = () => { }

export const calcNonce = (block) => {
  console.log(`calc nonce of block ${block.height} `)
  const start = new Date().getTime()
  let calcTimes = 0
  while (!block.isValid()) {
    // console.log("oldonce", block.nonce);
    // console.log("oldhash", block.hash);
    block.setNonce(sha256(new Date().getTime().toString()).toString())
    calcTimes++
    // console.log("newonce", block.nonce);
    // console.log("newhash", block.hash);
  }
  const end = new Date().getTime()
  console.log(
    `calc nonce cost ${(end - start) / 1000}s, try ${calcTimes} times`,
  )
  return block
}
