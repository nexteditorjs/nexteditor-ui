import { assert, NextEditor, NextEditorCallbacks } from "@nexteditorjs/nexteditor-core";

export default class NextEditorToolbarHandler implements NextEditorCallbacks {
  constructor(private editor: NextEditor) {

  }

  handleSelectionChange(editor: NextEditor): void {
    assert(editor === this.editor);
    //
    

  }
}
