import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import { map, extend, isFunction } from 'lodash';
import styled from 'styled-components';
import cn from 'classnames';
import backInfo from '../../helpers/backInfo';
import Purchases from '../../models/purchases';
import OXFancyLoader from 'shared/components/staxly-animation';
import { AsyncButton } from 'shared';
import NewTabLink from '../new-tab-link';
import UserMenu from '../../models/user/menu';
import RefundModal from './refund-modal';
import Header from '../header';
import Responsive from '../responsive';
import { colors, breakpoint } from 'theme';

const formatDate = (dte) => moment(dte).format('MMM Do YYYY');

const StyledContainer = styled.div`
  padding: 4rem 10rem 50rem;
  background-color: white;
  max-width: 1000px;
  margin: 0 auto;
  table {
    font-size: 1.4rem;
    thead th, tbody td {
      padding: 1rem;
    }
    tbody {
      td {
        vertical-align: middle;
      }
      .refunded .total {
        color: #489200;
      }
    }
  }
  .footer {
    margin: 10px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > * {
      margin-top: 10px;
    }
  }

  ${breakpoint.tablet`
    padding: 0;
    .footer {
      padding: 1rem ${breakpoint.margins.tablet};
    }
  `}
  ${breakpoint.mobile`
    padding: 0;
    .footer {
      padding: 1rem ${breakpoint.margins.mobile};
    }
  `}


`;

const PaymentInfoRows = styled.div` 
  .manage-payment-info-row:nth-child(odd) {
    background-color: ${colors.neutral.bright};
  }

  .manage-payment-info-row:last-child {
    border-bottom: 1px solid ${colors.neutral.pale};
  }

  .manage-payment-info-row {
    padding: 0 10px 10px;
    width: 100%;
    border-top: 1px solid ${colors.neutral.pale};
    ${breakpoint.tablet`
      padding: ${breakpoint.margins.tablet};
    `}
    ${breakpoint.mobile`
      padding: ${breakpoint.margins.mobile};
    `}
    .manage-payment-info {
      display: flex;
      margin-top: 10px;
      flex-wrap: wrap;

      > .refunded {
        color: #489200 !important;
      }

      > span:first-child {
        flex: 0 1 35%;
        font-size: 1.2rem;
        color: ${props => props.theme.colors.neutral.thin};
      }

      > span:last-child {
        flex: 0 1 50%;
        align-self: flex-end;
        font-size: 1.3rem;
        color: ${props => props.theme.colors.neutral.darker};
      }

      .invoice-link {
        font-weight: bold
      }
    }

    button {
      margin: 10px 0;
      font-size: 1.4rem;
    }
  }
`;

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

  UNSAFE_componentWillMount() {
    // for testing, it's helpful to insert a dummy payment record
    // to do this, comment out the fetch and uncomment the rest
    Purchases.fetch();
    // setTimeout(() => {
    //   Purchases.onLoaded({ data: { orders: [
    //     {
    //       identifier: 1234, product_instance_uuid: '387bf53c-ee0d-11ea-adc1-0242ac120002',
    //       is_refunded: false, sales_tax: 0.0, total: 10.00,
    //       updated_at: moment().subtract(1, 'week').toISOString(),
    //       purchased_at: moment().subtract(1, 'week').toISOString(),
    //       product: {
    //         name: 'OpenStax Tutor Beta', price: '10.00', uuid: 'fa882aa5-1093-43ff-aa7a-914ba3242f5a',
    //       },
    //     },
    //   ] } });
    // });
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
        <AsyncButton
          data-identifier={purchase.identifier}
          isWaiting={purchase.api.isPending}
          onClick={this.onRequestRefund}
        >
            Request Refund
        </AsyncButton>
      );
    } else {
      return null;
    }
  }


  renderInvoiceButton(purchase) {
    if (purchase.is_refund_record) { return null; }
    return (
      <a
        data-identifier={purchase.identifier}
        onClick={this.onShowInvoiceClick}
        href={purchase.invoiceURL}
        className="invoice-link"
      >
        Invoice
      </a>
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
            <th>Amount</th>
            <th>Invoice</th>
            {Purchases.isAnyRefundable && <th></th>}
          </tr>
        </thead>
        <tbody>
          {Purchases.withRefunds.map(purchase =>
            <tr key={purchase.identifier} className={cn({ refunded: purchase.is_refund_record })}>
              <td>{purchase.product.name}</td>
              <td>{formatDate(purchase.purchased_at)}</td>
              <td>{purchase.identifier}</td>
              <td className="total">
                {purchase.formattedTotal}
              </td>
              <td>{this.renderInvoiceButton(purchase)}</td>
              {Purchases.isAnyRefundable && <td className="refund">{this.renderRefundCell(purchase)}</td>}
            </tr>
          )}
        </tbody>
      </Table>
    );
  }

  renderList() {
    if (Purchases.isEmpty) { return this.renderEmpty(); }
    return (
      <PaymentInfoRows>
        {Purchases.withRefunds.map(purchase =>
          <div className="manage-payment-info-row" key={purchase.identifier}>
            <div className="manage-payment-info">
              <span>Item</span> 
              <span>
                {purchase.product.name}
              </span>
            </div>
            <div className="manage-payment-info">
              <span>Transaction date</span> 
              <span>
                {formatDate(purchase.purchased_at)}
              </span>
            </div>
            <div className="manage-payment-info">
              <span>Order number</span> 
              <span>
                {purchase.identifier}
              </span>
            </div>
            <div className="manage-payment-info">
              <span>Amount</span> 
              <span className={cn({ refunded: purchase.is_refund_record })}>
                {purchase.formattedTotal}
              </span>
            </div>
            <div className="manage-payment-info">
              <span>Invoice</span> 
              <span>
                {this.renderInvoiceButton(purchase)}
              </span>
            </div>
            {this.renderRefundCell(purchase)}
          </div>
        )}
      </PaymentInfoRows>
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
          backTo={back.to}
          backToText={back.text}
        />
        <StyledContainer className="manage-payments">
          <RefundModal
            purchase={this.refunding}
            onRefund={this.onRefundConfirm}
            onCancel={this.onRefundCancel}
          />
          {Purchases.api.isPending
            ? <OXFancyLoader isLoading />
            : <Responsive mobile={this.renderList()} tablet={this.renderList()} desktop={this.renderTable()} /> 
          }
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
        </StyledContainer>
      </>
    );
  }

}
