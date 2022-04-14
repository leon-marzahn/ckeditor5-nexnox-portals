import { Plugin } from '@ckeditor/ckeditor5-core';

export default class NxImageOverrideEditing extends Plugin {
  static get pluginName() {
	return 'NxImageOverrideEditing';
  }

  init() {
	this._defineConverters();
  }

  _defineConverters() {
	this.editor.conversion.for('downcast').elementToStructure({
	  model: 'imageInline',
	  view: (modelElement, { writer }) => {
		console.log('A');
		writer.createContainerElement('figure', { class: 'image' }, [
		  writer.createEmptyElement('img'),
		  writer.createSlot()
		]);
	  },
	  converterPriority: 'highest'
	});
  }
}
