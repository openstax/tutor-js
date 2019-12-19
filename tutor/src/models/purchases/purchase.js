import { find, pick, extend } from 'lodash';
import moment from 'moment';
import {
  BaseModel, identifiedBy, field, identifier, belongsTo, computed,
} from 'shared/model';
import Courses from '../courses-map';
import Time from '../time';
import S from '../../helpers/string';
import Payments from '../payments';

@identifiedBy('purchase/product')
class Product extends BaseModel {
  @identifier uuid;
  @field name;
  @field price;
}

export default
@identifiedBy('purchase')
class Purchase extends BaseModel {

  @identifier identifier;
  @field product_instance_uuid;
  @field is_refunded;
  @field sales_tax;
  @field total;
  @field({ type: 'date' }) updated_at;
  @field({ type: 'date' }) purchased_at;
  @belongsTo({ model: Product }) product;

  @computed get course() {
    return find(Courses.array, c =>
      c.userStudentRecord && c.userStudentRecord.uuid == this.product_instance_uuid);
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
           moment(this.purchased_at).add(14, 'days').isAfter(Time.now);
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
      this.course.userStudentRecord.markRefunded();
    }
  }

}
