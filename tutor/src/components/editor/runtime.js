import { DirectUpload } from '@rails/activestorage';
import { last, omit, isEmpty } from 'lodash';
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

export class EditorRuntime {

  constructor({ onSave }) {
    this.onSave = onSave;
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
          resolve({
            id: blob.id,
            width: 0,
            height: 0,
            src: `${STORAGE_PATH}/blobs/${blob.signed_id}/${blob.filename}`,
          });
        }
      });
    });
  }

  filterCommandGroups = (standardGroups) => {
    const updatedGroups = [];
    standardGroups.forEach(group => {
      const newGroup = omit(group, HIDDEN_COMMANDS);
      if (!isEmpty(newGroup)) {
        updatedGroups.push(newGroup);
      }
    });
    last(updatedGroups)['[save] Save'] = (new SaveCommand(this.onSave));
    return updatedGroups;
  }
}
