class MerkleNode {
  constructor(left, right, value) {
    this.left = left;
    this.right = right;
    this.value = value;
  }

  hash() {
    if (this.value) {
      return crypto.createHash('sha256').update(this.value).digest('hex')
    }

    const leftHash = this.left.hash();
    const rightHash = this.right.hash();

    return crypto.createHash('sha256').update(leftHash + rightHash).digest('hex')
  }
}

class MerkleTree {
  constructor(elements) {
    const leafNodes = elements.map(element => new MerkleNode(null, null, element));

    const allNodes = this.buildTree(leafNodes);

    this.root = allNodes[allNodes.length - 1];
  }

  buildTree(nodes) {
    if (nodes.length === 1) {
      return nodes;
    }

    const parents = [];

    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = i + 1 < nodes.length ? nodes[i + 1] : null;

      const parent = new MerkleNode(left, right, null);
      parents.push(parent);
    }

    return this.buildTree(parents);
  }

  getRoot() {
    return this.root.hash();
  }

  verify(proof, root, leaf) {
    let currentHash = crypto.createHash('sha256').update(leaf).digest('hex');

    for (let i = 0; i < proof.length; i++) {
      const branchHash = proof[i];

      if (currentHash === branchHash.left) {
        currentHash = crypto.createHash('sha256').update(branchHash.left + branchHash.right).digest('hex');
      } else if (currentHash === branchHash.right) {
        currentHash = crypto.createHash('sha256').update(branchHash.right + branchHash.left).digest('hex');
      }
    }

    return currentHash === root;
  }

  prove(element) {
    const proof = [];

    let nodes = [this.root];
    let found = false;

    while (!found) {
      const children = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (node.left && node.left.value === element) {
          proof.push({ left: node.left.hash(), right: node.right.hash() });
          found = true;
          break;
        }
        if (node.right && node.right.value === element) {
          proof.push({ left: node.left.hash(), right: node.right.hash() });
          found = true;
          break;
        }

        children.push(node.left);
        children.push(node.right);
      }

      nodes = children.filter(node => node !== null);
    }

    return proof;
  }
}
