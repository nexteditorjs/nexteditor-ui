import { CommandItem, createElement } from '@nexteditorjs/nexteditor-core';
import { createButton, createSeparator } from './button';
import icons from '../icons';

const IconNames: { [index: string]: string } = {
  'style-bold': 'format_bold',
  'style-italic': 'format_italic',
  'style-underline': 'format_underline',
  'style-line-through': 'format_strikethrough',
  'style-code': 'code',
};

function getButtonChildren(item: CommandItem) {
  if (item.element) {
    return item.element;
  }
  if (item.icon) {
    return item.icon;
  }
  //
  if (icons[item.id]) {
    return icons[item.id];
  }
  //
  const iconName = IconNames[item.id];
  if (iconName) {
    return `<span class="material-icons">${iconName}</span>`;
  }
  return item.name;
}

export function createToolbar(items: CommandItem[]) {
  const toolbar = createElement('div', ['editor-toolbar'], null);
  items.forEach((item) => {
    if (item.type === 'separator') {
      const separator = createSeparator('vertical');
      toolbar.append(separator);
    } else {
      const button = createButton(item.id, item.name, getButtonChildren(item), item.states);
      toolbar.appendChild(button);
    }
  });
  return toolbar;
}
