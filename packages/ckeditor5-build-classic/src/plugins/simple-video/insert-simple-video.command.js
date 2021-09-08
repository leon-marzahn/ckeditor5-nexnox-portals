import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertSimpleVideoCommand extends Command {
  execute(id) {
    const model = this.editor.model;

    model.change(writer => {
      const iframeElement = writer.createElement('simpleVideo', {
        src: `https://www.youtube.com/embed/${id}`
      });
      model.insertContent(iframeElement);
      writer.setSelection(iframeElement, 'on');
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'simpleVideo');

    this.isEnabled = allowedIn !== null;
  }
}
