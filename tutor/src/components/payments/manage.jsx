import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Container, Table, Button } from 'react-bootstrap';
import moment from 'moment';
import { map, extend, isFunction } from 'lodash';
import cn from 'classnames';
import Router from '../../helpers/router';
import backInfo from '../../helpers/backInfo';
import BackButton from '../buttons/back-button';
import Purchases from '../../models/purchases';
import OXFancyLoader from 'shared/components/staxly-animation';
import { AsyncButton } from 'shared';
import NewTabLink from '../new-tab-link';
import UserMenu from '../../models/user/menu';
import RefundModal from './refund-modal';
import Header from '../header';

const defaultOptions = {
  toolbar: 'no',
  location: 'no',
  directories: 'no',
  status: 'no',
  menubar: 'no',
  scrollbars: 'yes',
  resizable: 'yes',
  width: 500,
  height: 400,
  top: (o, w) => ((w.innerHeight - o.height) / 2) + w.screenY,
  left: (o, w) => ((w.innerWidth - o.width) / 2) + w.screenX,
};

function openWindow(url, options = {}) {
  const windowImpl = options.windowImpl || window;
  const windowOptions = map(extend({}, defaultOptions, options), (v, key, o) =>
    `${key}=${v = isFunction(v) ? v(o, windowImpl) : v}`
  ).join(',');
  return windowImpl.open(url, options.title, windowOptions);
}


export default
@observer
class ManagePayments extends React.Component {

  static propTypes = {
    windowImpl: PropTypes.shape({
      open: PropTypes.func,
    }),
  };

  @observable refunding;

  get backLink() {
    const params = Router.currentParams();
    return params.courseId ? { to: 'dashboard', text: 'Dashboard', params } :
      { to: 'myCourses', text: 'Back' };
  }

  UNSAFE_componentWillMount() {
    Purchases.fetch();
  }

  @action.bound
  onRequestRefund(ev) {
    this.refunding = Purchases.get(ev.target.dataset.identifier);
  }

  onShowInvoiceClick(ev) {
    ev.preventDefault();
    openWindow(ev.target.href, { width: 700, height: 500 });
  }

  renderEmpty() {
    return (
      <div className="empty">
        <h3>No payments were found for your account.</h3>
      </div>
    );
  }

  renderRefundCell(purchase) {
    if (purchase && purchase.isRefundable) {
      return (
        <td className="refund">
          <AsyncButton
            data-identifier={purchase.identifier}
            isWaiting={purchase.api.isPending}
            onClick={this.onRequestRefund}
          >
            Request Refund
          </AsyncButton>
        </td>
      );
    } else if (Purchases.isAnyRefundable) {
      return <td></td>;
    } else {
      return null;
    }
  }


  renderInvoiceButton(purchase) {
    if (purchase.is_refund_record) { return null; }
    return (
      <Button variant="link"
        data-identifier={purchase.identifier}
        onClick={this.onShowInvoiceClick}
        href={purchase.invoiceURL}
      >
        Invoice
      </Button>
    );
  }

  renderTable() {
    if (Purchases.isEmpty) { return this.renderEmpty(); }

    return (
      <Table striped>
        <thead>
          <tr>
            <th>Item</th>
            <th>Transaction date</th>
            <th>Order number</th>
            <th className="right">Amount</th>
            {this.renderRefundCell()}
          </tr>
        </thead>
        <tbody>
          {Purchases.withRefunds.map(purchase =>
            <tr key={purchase.identifier} className={cn({ refunded: purchase.is_refund_record })}>
              <td>{purchase.product.name}</td>
              <td>{moment(purchase.purchased_at).format('MMMM Do YYYY')}</td>
              <td>{purchase.identifier}</td>
              <td className="right total">
                {purchase.formattedTotal}
              </td>
              {this.renderRefundCell(purchase)}
              <td>
                {this.renderInvoiceButton(purchase)}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  }

  @action.bound
  onRefundConfirm() {
    this.refunding.refund();
    this.refunding = null;
  }

  @action.bound
  onRefundCancel() {
    this.refunding = null;
  }

  render() {
    const back = backInfo();
    return (
      <>
        <Header 
          unDocked={true}
          title="Manage Payments"
          backTo={back.to || 'myCourses'}
          backToText={back.text || 'Back'}
        />
        <Container className="manage-payments">
          <RefundModal
            purchase={this.refunding}
            onRefund={this.onRefundConfirm}
            onCancel={this.onRefundCancel}
          />
          {Purchases.api.isPending ? <OXFancyLoader isLoading /> : this.renderTable()}
          <div className="footer">
            <NewTabLink
              className="refund-policy"
              href="https://openstax.secure.force.com/help/articles/FAQ/OpenStax-Tutor-Beta-Student-Refund-Policy"
            >
            Refund policy for OpenStax Tutor Beta courses
            </NewTabLink>
            <div className="help">
            Need help? <a href={`mailto:${UserMenu.supportEmail}`}>Contact Support</a>
            </div>
          </div>
        </Container>
      </>
    );
  }

}
