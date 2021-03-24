import { modelize, field, BaseModel } from 'shared/model';

const STORAGE_PATH = '/rails/active_storage';

class Image extends BaseModel {
    static directUploadURL = `${STORAGE_PATH}/direct_uploads`
    static urlFromBlob(blob: any) {
        return `${STORAGE_PATH}/blobs/${blob.signed_id}/${blob.filename}`;
    }

    @field signed_id = '';
    @field url = '';

    constructor() {
        super()
        modelize(this)
    }
}

export default Image
