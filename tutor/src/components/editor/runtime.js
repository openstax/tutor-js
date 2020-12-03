import { DirectUpload } from '@rails/activestorage';
import { map, omit, isEmpty, pick } from 'lodash';
import { convertToHTML } from 'perry-white';

const STORAGE_PATH = '/rails/active_storage';

const HIDDEN_COMMANDS = [
  '[font_download] Font Type',
  '[format_size] Text Size',
  '[format_color_text] Text color',
  '[format_strikethrough] Strike through',
  '[border_color] Highlight color',
  '[format_clear] Clear formats',
  '[format_line_spacing] Line spacing',
  '[format_indent_decrease] Indent less',
  '[format_indent_increase] Indent more',
  '[format_align_justify] Justify',
  '[H1] Header 1',
  '[undo] Undo',
  '[redo] Redo',
];

const LIMITED_COMMANDS = [
  '[format_bold] Bold',
  '[format_italic] Italic',
  '[superscript] Superscript',
  '[subscript] Subscript',
  '[functions] Math',
  '[link] Apply link',
  '[format_clear] Clear formats',
];

export class LimitedEditorRuntime {
  constructor({ onSave }) {
    this.onSave = onSave;
  }

  canUploadImage() {
    return false;
  }

  onBlur(state) {
    this.onSave(convertToHTML(state));
  }

  filterCommandGroups(standardGroups) {
    const commands = {};
    standardGroups.forEach(group => {
      const newGroup = pick(group, LIMITED_COMMANDS);
      if (!isEmpty(newGroup)) {
        Object.assign(commands, newGroup);
      }
    });
    return [commands];
  }
}

export class FullFeaturedEditorRuntime {

  constructor({ onSave, onImageUpload }) {
    this.onSave = onSave;
    this.onImageUpload = onImageUpload;
  }

  canUploadImage() {
    return true;
  }

  uploadImage(file) {
    return new Promise((resolve, reject) => {
      const upload = new DirectUpload(file, `${STORAGE_PATH}/direct_uploads`);
      upload.create((error, blob) => {
        if (error) {
          reject(error);
        } else {
          const src = `${STORAGE_PATH}/blobs/${blob.signed_id}/${blob.filename}`;
          if (this.onImageUpload) {
            this.onImageUpload(blob, src);
          }
          resolve({
            id: blob.id,
            width: 0, // 0 will use images natural size
            height: 0,
            src,
          });
        }
      });
    });
  }

  onBlur(state) {
    this.onSave(convertToHTML(state));
  }

  filterCommandGroups(standardGroups) {
    const commands = {};
    standardGroups.forEach(group => {
      // console.log(Object.keys(group)) // for finding the commands to enable/disable
      Object.assign(commands, omit(group, HIDDEN_COMMANDS));
    });
    return map(commands, (cmd, label) => ({ [label]: cmd  }));
  }
}
