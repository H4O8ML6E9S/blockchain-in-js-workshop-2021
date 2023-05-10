/*
 * @Author: 南宫
 * @Date: 2023-05-10 22:01:31
 * @LastEditTime: 2023-05-10 22:07:01
 */
/*
 * @Author: 南宫
 * @Date: 2023-05-06 21:14:49
 * @LastEditTime: 2023-05-07 11:06:31
 */
import sha256 from 'crypto-js/sha256.js'

const main = () => {
  // return new Date().getTime()
  return sha256(new Date().getTime().toString()).toString()

}
console.log(main());