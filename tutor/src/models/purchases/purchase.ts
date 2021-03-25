import { find, pick, extend } from 'lodash';
import moment from 'moment';
import { BaseModel, field, model, computed, NEW_ID } from 'shared/model';
import DateTime from 'shared/model/date-time';
import Courses from '../courses-map';
import Time from '../time';
import S from '../../helpers/string';
import Payments from '../payments';

class Product extends BaseModel {
  @field uuid = NEW_ID;
  @field name;
  @field price;
}

export default class Purchase extends BaseModel {

  @field uuid = NEW_ID;
  @field product_instance_uuid;
  @field is_refunded;
  @field sales_tax;
  @field total;
  @model(DateTime) updated_at = DateTime.unknown;
  @model(DateTime) purchased_at = DateTime.unknown;
  @model(Product) product;

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
