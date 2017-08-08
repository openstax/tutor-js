import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Grid, Table, Button } from 'react-bootstrap';
import moment from 'moment';
import { map, extend, flatten, isFunction } from 'lodash';
import cn from 'classnames';
import Router from '../../helpers/router';
import BackButton from '../buttons/back-button';
import Purchases from '../../models/purchases';
import OXFancyLoader from '../ox-fancy-loader';
import { AsyncButton } from 'shared';
import NewTabLink from '../new-tab-link';
import UserMenu from '../../models/user/menu';
import RefundModal from './refund-modal';

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


@observer
export default class ManagePayments extends React.PureComponent {

  static propTypes = {
    windowImpl: React.PropTypes.shape({
      open: React.PropTypes.func,
    }),
  };

  @observable refunding;

  get backLink() {
    const params = Router.currentParams();
    return params.courseId ? { to: 'dashboard', text: 'Back to Dashboard', params } :
           { to: 'myCourses', text: 'Back to My Courses' };
  }

  componentWillMount() {
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
            isWaiting={purchase.hasApiRequestPending}
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

  @computed get purchases() {
    return flatten(map(Purchases.array, (purchase) =>
      purchase.is_refunded ? [ purchase, purchase.refundRecord ] : [ purchase ],
    ));
  }

  renderInvoiceButton(purchase) {
    if (purchase.is_refund_record) { return null; }
    return (
      <Button bsStyle="link"
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
          {this.purchases.map(purchase =>
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
    return (
      <Grid className="manage-payments">
        <RefundModal
          purchase={this.refunding}
          onRefund={this.onRefundConfirm}
          onCancel={this.onRefundCancel}
        />
        <header>
          <h1>Manage payments</h1>
          <BackButton fallbackLink={this.backLink} />
        </header>
        {Purchases.hasApiRequestPending ? <OXFancyLoader isLoading /> : this.renderTable()}
        <div className="footer">
          <NewTabLink
            className="refund-policy"
            to="http://openstax.force.com/support/articles/FAQ/OpenStax-Tutor-Student-Refund-Policy/?q=refund&l=en_US&c=Products%3ATutor&fs=Search&pn=1"
          >
            Refund policy for OpenStax Tutor Beta courses
          </NewTabLink>
          <div className="help">
            Need help?
            <NewTabLink to={UserMenu.helpURL}>Contact Support</NewTabLink>
          </div>
        </div>
      </Grid>
    );
  }

}
