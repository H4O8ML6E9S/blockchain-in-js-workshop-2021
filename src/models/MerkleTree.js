/*
 * @Author: 南宫
 * @Date: 2023-06-02 20:04:16
 * @LastEditTime: 2023-06-11 23:25:19
 */
import sha256 from 'crypto-js/sha256.js'
/* lesson6 */

class MerkleTreeNode {
  constructor(value = '', type = 'leaf', left = null, right = null) {
    this.value = value;
    this.type = type;
    this.left = left;
    this.right = right;
  }
}

class MerkleTree {
  constructor(values) {
    this.root = this.build(values);
  }

  // 根据给定的元素集合的排序并生成最终的 Merkle root 哈希
  build (values) {
    if (values.length === 1) {
      return new MerkleTreeNode(values[0], 'leaf');
    }

    const nodes = [];

    for (let i = 0; i < values.length; i += 2) {
      const left = new MerkleTreeNode(values[i], 'leaf');
      const right = i + 1 < values.length ? new MerkleTreeNode(values[i + 1], 'leaf') : null;
      const node = new MerkleTreeNode(this._calculateHash(left.value, right?.value), 'node', left, right);
      nodes.push(node);
    }

    return this.build(nodes);
  }

  // 计算节点的哈希值
  _calculateHash (left, right) {
    return sha256(left + (right ?? left)).toString();
  }

  // 元素的判断和证明的校验
  verify (element, proof, merkleRoot) {
    let currentHash = sha256(element).toString();

    for (let i = 0; i < proof.length; i++) {
      const node = proof[i];

      if (node.position === 'left') {
        currentHash = this._calculateHash(node.value, currentHash);
      } else {
        currentHash = this._calculateHash(currentHash, node.value);
      }
    }

    return currentHash === merkleRoot;
  }

  // 给定提供的元素和位置，生成哈希树的证明
  getProof (element) {
    const proof = [];
    let current = this.findNode(this.root, element);

    while (current.parent !== null) {
      if (current.parent.left === current) {
        proof.push({
          value: current.parent.right?.value ?? '',
          position: 'right',
        });
      } else {
        proof.push({
          value: current.parent.left?.value ?? '',
          position: 'left',
        });
      }

      current = current.parent;
    }

    return proof;
  }

  // 寻找哈希树中对应value的节点
  findNode (node, value) {
    if (node.type === 'leaf') {
      return node.value === value ? node : null;
    }

    const left = this.findNode(node.left, value);
    const right = this.findNode(node.right, value);

    return left ?? right;
  }
}

export default MerkleTree