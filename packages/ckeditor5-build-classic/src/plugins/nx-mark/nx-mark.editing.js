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
    this._definePostFixer();

    this.editor.commands.add('nxMark', new NxMarkCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.extend('$text', { allowAttributes: ['data-mark'] });
    schema.register('nxMark', {
      inheritAllFrom: '$text',
      isObject: true,
      allowChildren: '$text',
      allowAttributes: ['data-mark']
    });
  }

  _defineConverters() {
    this.editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'mark'
      },
      model: (viewElement, { writer }) => writer.createElement('nxMark', {
        'data-mark': viewElement.getAttribute('data-mark') || ''
      })
    });

    this.editor.conversion.for('dataDowncast').elementToElement({
      model: 'nxMark',
      view: (modelElement, { writer }) => writer.createContainerElement('mark', {
        'data-mark': modelElement.getAttribute('data-mark') || ''
      })
    });

    this.editor.conversion.for('editingDowncast').elementToElement({
      model: 'nxMark',
      view: (modelElement, { writer }) => {
        const color = modelElement.getAttribute('data-mark') || '';

        return writer.createContainerElement('mark', {
          class: `nx-mark nx-mark-${color}`,
          'data-mark': color
        });
      }
    });
  }

  _definePostFixer() {
    this.editor.model.document.registerPostFixer(writer => {
      const changes = this.editor.model.document.differ.getChanges();

      for (const entry of changes) {
        if (entry.type === 'remove') {
          const parent = entry.position.parent;

          if (parent.is('element', 'nxMark') && parent.isEmpty) {
            writer.remove(parent);
            return true;
          }
        }
      }

      return false;
    });
  }
}
