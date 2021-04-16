
import type { BaseModel } from '../../src/model'
import { ApiError, ApiErrorData } from '../../src/api/request'

export const stimulateApiError = (model: BaseModel, key: string, message: string, data?: ApiErrorData) => {
    const error = ApiError.fromMessage(key, message, data)
    model.api.errors.set(key, error)
    return error
}
