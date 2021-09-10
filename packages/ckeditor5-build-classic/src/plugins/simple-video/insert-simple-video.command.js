import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertSimpleVideoCommand extends Command {
  execute(id, platform) {
    const model = this.editor.model;

    model.change(writer => {
      const iframeElement = writer.createElement('simpleVideo', {
        src: platform.getEmbed(id)
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
