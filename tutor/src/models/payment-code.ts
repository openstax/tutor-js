import urlFor from '../api'
import {
    BaseModel,
    field,
    modelize,
    computed,
    model,
} from 'shared/model'
import Time from 'shared/model/time'

interface PaymentCodeData {
    code: string
    courseId: string
}

export class PaymentCode extends BaseModel {
    @field code = ''
    @field courseId = ''
    @model(Time) redeemed_at = Time.unknown

    constructor() {
        super()
        modelize(this)
    }

    isValid() {
        return Boolean(
            this.courseId && /^.+-[a-zA-Z0-9]{10}$/.test(this.code)
        )
    }

    @computed get hasErrorAlreadyRedeemed() {
        return this.api.errors.latest?.data?.code === 'already_redeemed'
    }

    @computed get hasErrorNotFound() {
        return this.api.errors.latest?.apiResponse?.status === 404
    }

    async redeem() {
        // Make sure a prior 404/422 doesn't influence post-success error state for UX use
        this.api.reset()
        await this.api.request<PaymentCodeData>(
            urlFor('redeemPaymentCode', { code: this.code }), { data: { course_id: this.courseId }, nothrow: true }
        )
    }
}
