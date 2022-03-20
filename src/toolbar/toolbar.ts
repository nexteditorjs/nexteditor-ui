import { NextEditor, CommandItem, assert } from '@nexteditorjs/nexteditor-core';
import tippy, { Instance } from 'tippy.js';
import { getButtonId, getParentButton } from '../components/button';
import { createToolbar } from '../components/toolbar';

import 'tippy.js/dist/tippy.css';

export class Toolbar {
  private items: CommandItem[] = [];

  onclick: ((toolbar: Toolbar, item: CommandItem) => void) | null = null;

  tippyInstance: Instance;

  constructor(public readonly editor: NextEditor) {
    this.tippyInstance = tippy(editor.rootElement, {
      trigger: 'manual',
      triggerTarget: null,
      hideOnClick: false,
    });
  }

  destroy() {
    this.unbindEvents();
    this.tippyInstance.destroy();
  }

  handleToolbarClick = (event: Event) => {
    if (!event.target) return;
    const button = getParentButton(event.target);
    if (button && this.onclick) {
      const buttonId = getButtonId(button);
      const item = this.items.find((item) => item.id === buttonId);
      assert(item, 'failed to find button in items');
      this.onclick(this, item);
    }
  };

  bindEvents(content: Element) {
    content.addEventListener('click', this.handleToolbarClick);
  }

  unbindEvents() {
    const oldContent = this.tippyInstance.props.content;
    if (oldContent instanceof Element) {
      oldContent.removeEventListener('click', this.handleToolbarClick);
    }
  }

  setItems(items: CommandItem[]) {
    this.items = items;
    this.unbindEvents();
    const toolbar = createToolbar(items);
    this.bindEvents(toolbar);
    this.tippyInstance.setContent(toolbar);
  }

  show(elem: Element, items: CommandItem[], rect?: DOMRect) {
    this.setItems(items);
    this.tippyInstance.setProps({
      triggerTarget: elem,
      getReferenceClientRect: () => {
        const refRect = rect ?? elem.getBoundingClientRect();
        // const editorRect = this.editor.rootElement.getBoundingClientRect();
        const left = refRect.left; // - editorRect.left;
        const top = refRect.top; // refRect.top - editorRect.top;
        return new DOMRect(left, top, refRect.width, refRect.height);
      },
    });
    if (!this.tippyInstance.state.isVisible) {
      this.tippyInstance.show();
    }
  }

  hide() {
    this.tippyInstance.hide();
  }
}
