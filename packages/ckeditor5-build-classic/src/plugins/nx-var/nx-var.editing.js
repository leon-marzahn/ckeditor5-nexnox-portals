import { Plugin } from '@ckeditor/ckeditor5-core';

import './theme/nx-var.css';

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

    schema.register('nxVar', {
      isObject: true,
      allowIn: '$block',
      allowChildren: ['$text'],
      allowAttributes: ['data-textvar']
    });

    schema.register('nxVarParagraph', {
      isObject: true,
      allowIn: '$root',
      allowChildren: ['$text'],
      allowAttributes: ['data-textvar']
    });
  }

  _defineConverters() {
    /* Inline */
    this.editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        attributes: 'data-textvar'
      },
      model: (modelElement, { writer }) => writer.createElement('nxVar')
    });

    this.editor.conversion.for('dataDowncast').elementToElement({
      model: 'nxVar',
      view: (viewElement, { writer }) => writer.createContainerElement('span', {
        'data-textvar': ''
      })
    });

    this.editor.conversion.for('editingDowncast').elementToElement({
      model: 'nxVar',
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
      model: (viewElement, { writer }) => writer.createElement('nxVarParagraph'),
      converterPriority: 'highest'
    });

    this.editor.conversion.for('dataDowncast').elementToElement({
      model: 'nxVarParagraph',
      view: (modelElement, { writer }) => writer.createContainerElement('p', {
        'data-textvar': ''
      }),
      converterPriority: 'high'
    });

    this.editor.conversion.for('editingDowncast').elementToElement({
      model: 'nxVarParagraph',
      view: (modelElement, { writer }) => writer.createContainerElement('p', {
        class: 'nx-var',
        'data-textvar': ''
      }),
      converterPriority: 'high'
    });
  }
}
