import { Plugin } from '@ckeditor/ckeditor5-core';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

import InsertSimpleVideoCommand from './insert-simple-video.command';

import './theme/simple-video.css';

export default class SimpleVideoEditing extends Plugin {
  static get pluginName() {
    return 'SimpleVideoEditing';
  }

  constructor(editor) {
    super(editor);

    this.editor.config.define('simpleVideo', {
      platforms: [
        {
          key: 'youtube',
          match: /^(https:\/\/(www\.)?youtube\.com\/watch\?v=)([A-Za-z0-9._%+-]+)$/,
          getId: matches => matches[3] && matches[3].length ? matches[3] : null,
          getEmbed: id => `https://www.youtube.com/embed/${id}`
        },
        {
          key: 'vimeo',
          match: /^(https:\/\/(www\.)?vimeo\.com\/)([0-9]+)$/,
          getId: matches => {
            console.log(matches);
            return matches[3] && matches[3].length ? matches[3] : null;
          },
          getEmbed: id => `https://player.vimeo.com/video/${id}`
        }
      ]
    });
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('insertSimpleVideo', new InsertSimpleVideoCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('simpleVideo', {
      isObject: true,
      allowIn: '$root',
      allowAttributes: ['src']
    });
  }

  _defineConverters() {
    this.editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'iframe'
      },
      model: (viewElement, { writer }) => upcastSimpleVideo(writer, viewElement)
    });

    this.editor.conversion.for('dataDowncast').elementToElement({
      model: 'simpleVideo',
      view: (modelElement, { writer }) => writer.createRawElement('iframe', {
        src: modelElement.getAttribute('src') || '',
		allow: 'fullscreen',
        width: 640,
        height: 360
      })
    });

    this.editor.conversion.for('editingDowncast').elementToElement({
      model: 'simpleVideo',
      view: (modelElement, { writer }) => toWidget(downcastSimpleVideo(writer, modelElement), writer, {
        label: 'Simple video widget'
      })
    });
  }
}

function upcastSimpleVideo(writer, viewElement) {
  const url = viewElement.getAttribute('src') || '';

  return writer.createElement('simpleVideo', {
    src: url
  });
}

function downcastSimpleVideo(writer, modelElement) {
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
    style: 'position: absolute; top: 0; left: 0;',
    frameborder: 0,
    width: 640,
    height: 360,
    allow: 'autoplay; encrypted-media; fullscreen'
  });

  writer.insert(writer.createPositionAt(iframeWrapper, 0), iframe);
  writer.insert(writer.createPositionAt(simpleVideoWrapper, 0), iframeWrapper);
  writer.insert(writer.createPositionAt(simpleVideo, 0), simpleVideoWrapper);

  return simpleVideo;
}
