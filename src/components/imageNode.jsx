import { DecoratorNode } from 'lexical';
import React from 'react';

function safeImageSrc(src) {
  const value = String(src || "").trim();
  return /^https?:\/\//i.test(value) ? value : "";
}

function ImageComponent({ src, alt }) {
  if (!src) return null;
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
    this.__src = safeImageSrc(src);
    this.__alt = alt;
  }

  createDOM() {
    const img = document.createElement('img');
    if (this.__src) img.src = this.__src;
    img.alt = this.__alt || "";
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
    return new ImageNode(safeImageSrc(src), alt);
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
  return new ImageNode(safeImageSrc(src), alt);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
