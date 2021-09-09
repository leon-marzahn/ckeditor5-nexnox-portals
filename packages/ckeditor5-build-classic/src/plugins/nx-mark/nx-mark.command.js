import { Command } from '@ckeditor/ckeditor5-core';

export default class NxMarkCommand extends Command {
  execute(options = {}) {
    const model = this.editor.model;
    const document = model.document;
    const selection = document.selection;

    const marker = options.value;
  }

  refresh() {
    const document = this.editor.model.document;
    const selection = document.selection;
    const focus = selection.focus;

    if (focus.parent && focus.parent.hasAttribute('data-mark')) {
      this.value = focus.parent.getAttribute('data-mark');
    } else {
      this.value = null;
    }

    this.isEnabled = this.editor.model.schema.checkAttributeInSelection(selection, 'data-mark');
  }
}
