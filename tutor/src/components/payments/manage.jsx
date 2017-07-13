import React from 'react';
import Router from '../../helpers/router';
import { observer } from 'mobx-react';
import { Grid, Table } from 'react-bootstrap';
import BackButton from '../buttons/back-button';
import Purchases from '../../models/purchases';
import OXFancyLoader from '../ox-fancy-loader';
import moment from 'moment';

@observer
export default class ManagePayments extends React.PureComponent {

  get backLink() {
    const params = Router.currentParams();
    return params.courseId ? { to: 'dashboard', text: 'Back to Dashboard', params } :
           { to: 'myCourses', text: 'Back to My Courses' };
  }

  componentWillMount() {
    Purchases.fetch();
  }

  renderTable() {
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Item</th>
            <th>Transaction date</th>
            <th>Order number</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Purchases.array.map(purchase =>
            <tr key={purchase.uuid}>
              <td>{purchase.product_name}</td>
              <td>{moment(purchase.occured_at).format('MMMM Do YYYY')}</td>
              <td>{purchase.order_number}</td>
              <td>{purchase.amount}</td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <Grid className="manage-payments">
        <header>
          <h1>Manage payments</h1>
          <BackButton fallbackLink={this.backLink} />
        </header>
        {Purchases.hasApiRequestPending ? <OXFancyLoader isLoading /> : this.renderTable()}
      </Grid>
    );
  }

}
