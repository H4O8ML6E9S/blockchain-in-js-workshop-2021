import sha256 from 'crypto-js/sha256.js'

class MerkleTree {
  constructor(elements) {
    this.elements = elements
    this.tree = this._buildTree(this.elements)
  }

  _buildTree (elements) {
    const len = elements.length

    if (len === 1) {
      const hash = sha256(elements[0]).toString()
      return [{ hash: hash, left: null, right: null }]
    }

    const nodes = []
    for (let i = 0; i < len; i += 2) {
      const left = elements[i]
      const right = i + 1 === len ? '' : elements[i + 1]
      const hash = sha256(left + right).toString()

      const node = { hash: hash, left: left, right: right }
      nodes.push(node)
    }

    return this._buildTree(nodes)
  }

  getRootHash () {
    return this.tree[0].hash
  }
}

export default MerkleTree
