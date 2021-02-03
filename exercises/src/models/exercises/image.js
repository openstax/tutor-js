import { identifiedBy, field, BaseModel } from 'shared/model';


const STORAGE_PATH = '/rails/active_storage';


@identifiedBy('exercises/exercise/image')
class Image extends BaseModel {
  static directUploadURL = `${STORAGE_PATH}/direct_uploads`
  static urlFromBlob(blob) {
    return `${STORAGE_PATH}/blobs/${blob.signed_id}/${blob.filename}`;
  }

  @field signed_id;
  @field url;

}

export default Image
