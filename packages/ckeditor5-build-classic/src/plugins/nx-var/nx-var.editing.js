import { Plugin } from '@ckeditor/ckeditor5-core';

export default class NxVarEditing extends Plugin {
  static get pluginName() {
    return 'NxVarEditing';
  }

  init() {
    this._defineSchema();
    this._defineConverters();
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.extend('$text', {
      allowAttributes: ['data-textvar']
    });

    schema.extend('paragraph', {
      allowAttributes: ['data-textvar']
    });
  }

  _defineConverters() {
    /* Inline */
    this.editor.conversion.for('upcast').elementToAttribute({
      view: {
        name: 'span',
        attributes: 'data-textvar'
      },
      model: {
        key: 'data-textvar',
        value: viewElement => viewElement.getAttribute('data-textvar')
      }
    });

    this.editor.conversion.for('dataDowncast').elementToElement({
      model: {
        name: '$text',
        attributes: 'data-textvar'
      },
      view: (viewElement, { writer }) => writer.createContainerElement('span', {
        'data-textvar': ''
      })
    });

    this.editor.conversion.for('editingDowncast').elementToElement({
      model: {
        name: '$text',
        attributes: 'data-textvar'
      },
      view: (viewElement, { writer }) => writer.createContainerElement('span', {
        class: 'nx-var',
        'data-textvar': ''
      })
    });

    /* Block */
    this.editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'p',
        attributes: 'data-textvar'
      },
      model: (viewElement, { writer }) => writer.createElement('paragraph', {
        'data-textvar': viewElement.getAttribute('data-textvar')
      }),
      converterPriority: 'highest'
    });

    this.editor.conversion.for('dataDowncast').elementToElement({
      model: {
        name: 'paragraph',
        attributes: 'data-textvar'
      },
      view: (viewElement, { writer }) => writer.createContainerElement('p', {
        'data-textvar': ''
      }),
      converterPriority: 'highest'
    });

    this.editor.conversion.for('editingDowncast').elementToElement({
      model: {
        name: 'paragraph',
        attributes: 'data-textvar'
      },
      view: (viewElement, { writer }) => writer.createContainerElement('p', {
        class: 'nx-var',
        'data-textvar': ''
      }),
      converterPriority: 'highest'
    });
  }
}
