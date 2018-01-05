import React from 'react';
import { observer } from 'mobx-react';
import BookMenu from '../../components/book-menu/menu';
import UX from './ux';

@observer
export default class QAView extends React.Component {

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
  };

  componentDidMount() {
    this.props.ux.ecosystem.referenceBook.fetch();
  }

  render() {
    const { ux } = this.props;

    return (
      <div className="qa-view content">
        <BookMenu ux={ux} />

      </div>

    );
  }

}
