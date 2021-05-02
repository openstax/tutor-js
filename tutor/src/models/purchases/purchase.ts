import { pick, extend } from 'lodash';
import { BaseModel, field, model, computed, modelize, NEW_ID } from 'shared/model';
import Time from 'shared/model/time';
import S from '../../helpers/string';
import { currentCourses } from '../../../src/models'

class Product extends BaseModel {
    @field uuid = '';
    @field name = '';
    @field price = '';

    constructor() {
        super();
        modelize(this);
    }
}

export class Purchase extends BaseModel {

    static invoice_base_url = ''

    @field id = NEW_ID;
    @field product_instance_uuid = '';
    @field identifier = '';
    @field refund_survey = '';
    @field is_refunded = false;
    @field sales_tax = 0;
    @field total = 0;
    @model(Time) updated_at = Time.unknown;
    @model(Time) purchased_at = Time.unknown;
    @model(Product) product = new Product();

    courses = currentCourses

    constructor() {
        super();
        modelize(this);
    }

    @computed get course() {
        return this.courses.array.find(c => c.userStudentRecord && c.userStudentRecord.uuid == this.product_instance_uuid)
    }

    @computed get refundRecord() {
        if (!this.is_refunded) { return null; }
        return extend(pick(this, [
            'is_refunded', 'sales_tax', 'total',
        ]), {
            purchased_at: this.updated_at,
            is_refund_record: true,
            formattedTotal: `-${this.formattedTotal}`,
            identifier: `${this.identifier}:refund`,
            product: { name: `${this.product.name} refund` },
        });
    }

    @computed get isRefundable() {
        return !this.is_refunded && this.purchased_at.plus({ days: 14 }).isInFuture
    }

    @computed get invoiceURL() {
        return `${Purchase.invoice_base_url}/invoice/${this.identifier}`;
    }

    @computed get formattedTotal() {
        const amount = S.numberWithTwoDecimalPlaces(this.total);
        return amount;
    }

    refund() {
        return { item_uuid: this.product_instance_uuid, refund_survey: this.refund_survey };
    }

    onRefunded() {
        this.is_refunded = true;
        if (this.course) {
            this.course.userStudentRecord?.markRefunded();
        }
    }

}
