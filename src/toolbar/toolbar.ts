import { NextEditor, CommandItem } from "@nexteditorjs/nexteditor-core";
import tippy, { Instance } from "tippy.js";
import 'tippy.js/dist/tippy.css';

export class Toolbar {
  private items: CommandItem[] = [];

  tippyInstance: Instance;

  constructor(private editor: NextEditor) {
    this.tippyInstance = tippy(editor.rootElement, {
      trigger: 'manual',
      triggerTarget: null,
    });
  }

  setItems(items: CommandItem[]) {
    this.items = items;
    const content = items.map((item) => item.name).join();
    // update contents
    this.tippyInstance.setContent(content);
  }

  show(elem: Element, items: CommandItem[], rect?: DOMRect) {
    this.setItems(items);
    this.tippyInstance.setProps({
      triggerTarget: elem,
      getReferenceClientRect: () => {
        const refRect = rect ?? elem.getBoundingClientRect();
        const editorRect = this.editor.rootElement.getBoundingClientRect();
        const left = refRect.left - editorRect.left;
        const top = refRect.top - editorRect.top;
        return new DOMRect(left, top, refRect.width, refRect.height);
      }
    });
    if (!this.tippyInstance.state.isVisible) {
      this.tippyInstance.show();
    }
  }

  hide() {
    this.tippyInstance.hide();
  }
}