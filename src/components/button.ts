import { assert, createElement } from "@nexteditorjs/nexteditor-core";

export function getButtonId(button: HTMLButtonElement) {
  const id = button.getAttribute('data-button-id');
  if (!id) {
    assert(false, 'unknown button id');
  }
  return id;
}

export function getParentButton(target: EventTarget): HTMLButtonElement | null {
  if (!(target instanceof Node)) {
    return null;
  }
  const element = target.parentElement;
  if (!element) {
    return null;
  }
  if (target instanceof HTMLButtonElement) {
    if (target.classList.contains('editor-button')) {
      return target;
    }
  }
  return element.closest('button.editor-button') ?? null;
}

export function createButton(id: string, name: string, child?: string | Element) {
  const button = createElement('button', ['editor-button'], null);
  button.setAttribute('data-button-id', id);
  if (child) {
    if (typeof child === 'string') {
      if (child.startsWith('<')) {
        button.innerHTML = child;
      } else {
        button.innerText = child;
      }
    } else {
      button.appendChild(child);
    }
  } else {
    button.innerText = name;
  }
  return button;
}

export function createSeparator(type: 'horizontal' | 'vertical') {
  const elem = createElement('span', ['editor-separator', type], null);
  return elem;
}