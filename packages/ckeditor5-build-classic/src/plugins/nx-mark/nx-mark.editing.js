import { Plugin } from '@ckeditor/ckeditor5-core';
import { toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';

import './theme/nx-mark.css';

export default class NxMarkEditing extends Plugin {
  static get pluginName() {
    return 'NxMarkEditing';
  }

  init() {
    this._defineSchema();
    this._defineConverters();
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('nxMark', {
      allowIn: '$block',
      allowChildren: '$text',
      isObject: true,
      isInline: true,
      allowAttributes: ['color']
    });

    schema.extend('$text', {
      allowIn: 'nxMark'
    });
  }

  _defineConverters() {
    this.editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'mark',
        attributes: {
          'data-mark': /^(green|red)$/
        }
      },
      model: (viewElement, { writer }) => writer.createElement('nxMark', {
        color: viewElement.getAttribute('data-mark') || ''
      })
    });

    this.editor.conversion.for('dataDowncast').elementToElement({
      model: 'nxMark',
      view: (modelElement, { writer }) => writer.createRawElement('mark', {
        'data-mark': modelElement.getAttribute('color') || ''
      })
    });

    this.editor.conversion.for('editingDowncast').elementToElement({
      model: 'nxMark',
      view: (modelElement, { writer }) => {
        const color = modelElement.getAttribute('color') || '';
        const markElement = writer.createEditableElement('nxMark', {
          class: `nx-mark nx-mark-${color}`
        });

        return toWidgetEditable(markElement, writer);
      }
    });
  }
}
