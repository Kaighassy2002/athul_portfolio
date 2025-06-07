import { DecoratorNode } from 'lexical';
import React from 'react';

function ImageComponent({ src, alt }) {
  return <img src={src} alt={alt} style={{ maxWidth: '100%' }} />;
}

export class ImageNode extends DecoratorNode {
  __src;
  __alt;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  constructor(src, alt, key) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  createDOM() {
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__alt;
    img.style.maxWidth = '100%';
    return img;
  }

  updateDOM(prevNode, dom) {
    if (this.__src !== prevNode.__src) {
      dom.src = this.__src;
    }
    if (this.__alt !== prevNode.__alt) {
      dom.alt = this.__alt;
    }
    return false;
  }

  decorate() {
    return <ImageComponent src={this.__src} alt={this.__alt} />;
  }

  static importJSON(serializedNode) {
    const { src, alt } = serializedNode;
    return new ImageNode(src, alt);
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      alt: this.__alt,
    };
  }
}

export function $createImageNode(src, alt) {
  return new ImageNode(src, alt);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
