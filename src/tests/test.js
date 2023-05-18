/*
 * @Author: 南宫
 * @Date: 2023-05-18 00:06:20
 * @LastEditTime: 2023-05-18 00:06:35
 */
import sha256 from 'crypto-js/sha256.js'

console.log(sha256(new Date().getTime().toString()).toString())
