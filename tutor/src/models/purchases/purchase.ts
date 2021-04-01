import { find, pick, extend } from 'lodash';
import moment from 'moment';
import { BaseModel, field, model, computed, modelize, NEW_ID } from 'shared/model';
import DateTime from 'shared/model/date-time';
import Time from 'shared/model/time';
import Courses from '../courses-map';
import S from '../../helpers/string';
import Payments from '../payments';
import Course from '../course';

class Product extends BaseModel {
    @field uuid = NEW_ID;
    @field name = '';
    @field price = '';

    constructor() {
        super();
        modelize(this);
    }
}

export default class Purchase extends BaseModel {

    @field id = NEW_ID;
    @field uuid = NEW_ID;
    @field product_instance_uuid = '';
    @field identifier = '';
    @field refund_survey = '';
    @field is_refunded = false;
    @field sales_tax = 0;
    @field total = 0;
    @model(DateTime) updated_at = DateTime.unknown;
    @model(DateTime) purchased_at = DateTime.unknown;
    @model(Product) product = new Product();

    constructor() {
        super();
        modelize(this);
    }

    @computed get course() {
        return find(Courses.array, c =>
            c.userStudentRecord && c.userStudentRecord.uuid == this.product_instance_uuid) as Course | undefined;
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
        return !this.is_refunded &&
           moment(this.purchased_at.toString()).add(14, 'days').isAfter(Time.now);
    }

    @computed get invoiceURL() {
        return `${Payments.config.base_url}/invoice/${this.identifier}`;
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
