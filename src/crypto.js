import elliptic from "elliptic";
const ec = new elliptic.ec("secp256k1"); // 创建 secp256k1 椭圆曲线加密对象

// 生成公钥和私钥的函数
export function generatePair () {
  const keypair = ec.genKeyPair(); // 随机生成一个公钥和私钥对
  window.keypair = keypair; // 将 keypair 存入全局 window 对象中，方便调试
  return {
    publicKey: keypair.getPublic("hex"), // 获取公钥的 hex 格式字符串
    privateKey: keypair.getPrivate("hex") // 获取私钥的 hex 格式字符串
  };
}

// 签名函数
export function sign (message, privateKey) {
  try {
    const keypair = ec.keyFromPrivate(privateKey, "hex"); // 根据私钥字符串创建一个椭圆曲线加密私钥对象
    return keypair.sign(message).toDER("hex"); // 对 message 进行数字签名并将签名转换为 DER 格式的 hex 格式字符串
  } catch (error) {
    return "invalid signature"; // 处理异常情况（例如私钥不合法等）
  }
}

// 验证签名函数
export function verifySignature (message, signature, publicKey) {
  try {
    const keypair = ec.keyFromPublic(publicKey, "hex"); // 根据公钥字符串创建一个椭圆曲线加密公钥对象
    return ec.verify(message, signature, keypair); // 对 message 和 signature 进行数字签名验证，返回一个布尔值
  } catch (error) {
    return false; // 处理异常情况（例如公钥不合法等）
  }
}
