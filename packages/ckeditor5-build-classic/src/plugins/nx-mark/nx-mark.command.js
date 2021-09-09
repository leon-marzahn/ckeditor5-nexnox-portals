import { Command } from '@ckeditor/ckeditor5-core';

export default class NxMarkCommand extends Command {
  execute(options = {}) {
    const model = this.editor.model;
    const document = model.document;
    const selection = document.selection;

    const marker = options.value;

    model.change(writer => {
      if (selection.isCollapsed) {
        const position = selection.getFirstPosition();

        if (selection.hasAttribute('data-mark')) {
          const isSameMark = value => value.item.hasAttribute('data-mark') && value.item.getAttribute('data-mark') === this.value;
          const markStart = position.getLastMatchingPosition(isSameMark, { direction: 'backward' });
          const markEnd = position.getLastMatchingPosition(isSameMark);
          const markRange = writer.createRange(markStart, markEnd);

          if (!marker || this.value === marker) {
            if (!position.isEqual(markEnd)) {
              writer.removeAttribute('data-mark', markRange);
            }

            writer.removeSelectionAttribute('data-mark');
          } else {
            if (!position.isEqual(markEnd)) {
              writer.setAttribute('data-mark', marker, markRange);
            }

            writer.setSelectionAttribute('data-mark', marker);
          }
        } else if (marker) {
          writer.setSelectionAttribute('data-mark', marker);
        }
      } else {
        const ranges = model.schema.getValidRanges(selection.getRanges(), 'data-mark');

        for (const range of ranges) {
          if (marker) {
            writer.setAttribute('data-mark', marker, range);
          } else {
            writer.removeAttribute('data-mark', range);
          }
        }
      }
    });
  }

  refresh() {
    const document = this.editor.model.document;

    this.value = document.selection.getAttribute('data-mark');
    this.isEnabled = this.editor.model.schema.checkAttributeInSelection(document.selection, 'data-mark');
  }
}
