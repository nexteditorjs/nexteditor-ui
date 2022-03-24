import { CommandItem, createElement } from '@nexteditorjs/nexteditor-core';
import { createButton, createSeparator } from './button';

export function createToolbar(items: CommandItem[]) {
  const toolbar = createElement('div', ['editor-toolbar'], null);
  items.forEach((item) => {
    if (item.type === 'separator') {
      const separator = createSeparator('vertical');
      toolbar.append(separator);
    } else {
      const button = createButton(item.id, item.name, item.icon, item.states);
      toolbar.appendChild(button);
    }
  });
  return toolbar;
}
