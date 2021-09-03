import { Plugin } from '@ckeditor/ckeditor5-core';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

import InsertSimpleVideoCommand from './insert-simple-video.command';

import './simple-video.css';

export default class SimpleVideoEditing extends Plugin {
  static get pluginName() {
    return 'SimpleVideoEditing';
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('insertSimpleVideo', new InsertSimpleVideoCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('iframe', {
      isObject: true,
      allowWhere: '$block',
      allowAttributes: ['src']
    });
  }

  _defineConverters() {
    this.editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'figure',
        classes: 'simple-video'
      },
      model: (viewElement, { writer }) => {
        return writer.createElement('iframe', {
          src: viewElement.getChild(0).getChild(0).getChild(0).getAttribute('src')
        });
      }
    });

    this.editor.conversion.for('dataDowncast').elementToElement({
      model: 'iframe',
      view: (modelElement, { writer }) => downcastModelElement(writer, modelElement)
    });

    this.editor.conversion.for('editingDowncast').elementToElement({
      model: 'iframe',
      view: (modelElement, { writer }) => {
        return toWidget(downcastModelElement(writer, modelElement), writer, {
          label: 'Simple video widget'
        });
      }
    });
  }
}

function downcastModelElement(writer, modelElement) {
  const url = modelElement.getAttribute('src') || '';
  const simpleVideo = writer.createContainerElement('figure', {
    class: 'simple-video'
  });

  const simpleVideoWrapper = writer.createContainerElement('div', {
    class: 'simple-video-wrapper'
  });

  const iframeWrapper = writer.createContainerElement('div', {
    style: 'position: relative; margin: 0; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;'
  });

  const iframe = writer.createRawElement('iframe', {
    src: url,
    style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;',
    frameborder: 0,
    allow: 'autoplay; encrypted-media',
    allowfullscreen: true
  });

  writer.insert(writer.createPositionAt(iframeWrapper, 0), iframe);
  writer.insert(writer.createPositionAt(simpleVideoWrapper, 0), iframeWrapper);
  writer.insert(writer.createPositionAt(simpleVideo, 0), simpleVideoWrapper);

  return simpleVideo;
}
