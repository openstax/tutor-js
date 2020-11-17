import { DirectUpload } from '@rails/activestorage';
import { last } from 'lodash'
import { Editor, convertToHTML, convertFromHTML, UICommand } from 'perry-white'

const STORAGE_PATH = '/rails/active_storage';

class SaveCommand extends UICommand {

  constructor(onClick) {
    super()
    this.onClick = onClick
  }

  isEnabled() { return true }
  isActive() { return true }

  execute = (state) => {
    this.onClick(convertToHTML(state))
  }
}

export class EditorRuntime {

  constructor({ onSave }) {
    this.onSave = onSave // (html) => onSave(html)
  }

  canUploadImage() {
    return true
  }

  uploadImage(file) {
    return new Promise((resolve, reject) => {
      const upload = new DirectUpload(file, `${STORAGE_PATH}/direct_uploads`);
      upload.create((error, blob) => {
        if (error) {
          reject(error)
        } else {
          resolve({
            id: blob.id,
            width: 0,
            height: 0,
            src: `${STORAGE_PATH}/blobs/${blob.signed_id}/${blob.filename}`,
          })
        }
      });
    })
  }

  filterCommandGroups = (groups) => {
    last(groups)['[save] Save'] = (new SaveCommand(this.onSave))
    return groups
  }
}
