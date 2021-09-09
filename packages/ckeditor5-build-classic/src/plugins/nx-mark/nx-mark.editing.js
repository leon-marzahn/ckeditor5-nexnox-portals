import { Plugin } from '@ckeditor/ckeditor5-core';
import NxMarkCommand from './nx-mark.command';

import './theme/nx-mark.css';

export default class NxMarkEditing extends Plugin {
  static get pluginName() {
    return 'NxMarkEditing';
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('nxMark', new NxMarkCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.extend('$text', { allowAttributes: ['data-mark'] });
  }

  _defineConverters() {
    this.editor.conversion.for('upcast').elementToAttribute({
      view: {
        name: 'mark',
        attributes: 'data-mark'
      },
      model: {
        key: 'data-mark',
        value: viewElement => viewElement.getAttribute('data-mark') || 'green'
      }
    });

    this.editor.conversion.for('dataDowncast').attributeToElement({
      model: {
        name: '$text',
        key: 'data-mark'
      },
      view: (attributeValue, { writer }) => writer.createAttributeElement('mark', {
        'data-mark': attributeValue
      })
    });

    this.editor.conversion.for('editingDowncast').attributeToElement({
      model: {
        name: '$text',
        key: 'data-mark'
      },
      view: (attributeValue, { writer }) => writer.createAttributeElement('mark', {
        class: `nx-mark nx-mark-${attributeValue}`,
        'data-mark': attributeValue
      })
    });
  }
}
