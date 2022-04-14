/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageBlock from '@ckeditor/ckeditor5-image/src/imageblock';

import SimpleVideoPlugin from './plugins/simple-video/simple-video.plugin';
import NxMarkPlugin from './plugins/nx-mark/nx-mark.plugin';
import NxImageOverridePlugin from './plugins/nx-image-override/nx-image-override.plugin';

export default class ClassicEditor extends ClassicEditorBase {
}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
  Essentials,
  UploadAdapter,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  CKFinder,
  CloudServices,
  EasyImage,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageResize,
  Indent,
  Link,
  List,
  SimpleVideoPlugin,
  NxMarkPlugin,
  // NxVarPlugin,
  NxImageOverridePlugin,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation
];

// Editor configuration.
ClassicEditor.defaultConfig = {
  toolbar: {
	items: [
	  'heading',
	  '|',
	  'bold', 'italic', 'underline', 'nxMark',
	  '|',
	  'bulletedList', 'numberedList', 'indent', 'outdent',
	  '|',
	  'insertTable', 'imageUpload', 'simpleVideo',
	  '|',
	  'undo', 'redo'
	]
  },
  table: {
	contentToolbar: [
	  'tableColumn',
	  'tableRow',
	  'mergeTableCells'
	]
  },
  image: {
	toolbar: [
	  'imageTextAlternative'
	],
	insert: {
	  type: 'block'
	},
	styles: {
	  options: []
	},
	upload: {
	  types: [
		'jpeg', 'png'
	  ]
	}
  },
  // This value must be kept in sync with the language defined in webpack.config.js.
  language: 'en'
};
