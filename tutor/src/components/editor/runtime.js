import { DirectUpload } from '@rails/activestorage';
import { map, omit, isEmpty, pick } from 'lodash';
import { convertToHTML, UICommand } from 'perry-white';

const STORAGE_PATH = '/rails/active_storage';

const HIDDEN_COMMANDS = [
  '[font_download] Font Type',
  '[format_size] Text Size',
  '[format_color_text] Text color',
  '[border_color] Highlight color',
  '[format_clear] Clear formats',
  '[undo] Undo',
  '[redo] Redo',
];

const LIMITED_COMMANDS = [
  '[format_bold] Bold',
  '[format_italic] Italic',
  '[superscript] Superscript',
  '[functions] Math',
  '[link] Apply link',
  '[format_clear] Clear formats',
];

class SaveCommand extends UICommand {

  constructor(onClick) {
    super();
    this.onClick = onClick;
  }

  isEnabled() { return true; }
  isActive() { return true; }

  execute = (state) => {
    this.onClick(convertToHTML(state));
  }
}

export class LimitedEditorRuntime {
  constructor({ onSave }) {
    this.onSave = onSave;
  }

  canUploadImage() {
    return false;
  }

  filterCommandGroups(standardGroups) {
    const commands = {};

    standardGroups.forEach(group => {
      const newGroup = pick(group, LIMITED_COMMANDS);
      if (!isEmpty(newGroup)) {
        Object.assign(commands, newGroup);
      }
    });
    commands['[save] Save'] = new SaveCommand(this.onSave);
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

  filterCommandGroups(standardGroups) {
    const commands = {};
    standardGroups.forEach(group => {
      Object.assign(commands, omit(group, HIDDEN_COMMANDS));
    });
    commands['[save] Save'] = new SaveCommand(this.onSave);
    return map(commands, (cmd, label) => ({ [label]: cmd  }));
  }
}
