import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import classnames from 'classnames';
import Exercise from '../../../models/exercises/exercise';

@observer
class Attachment extends React.Component {
  static propTypes = {
    attachment: React.PropTypes.shape({
      asset: React.PropTypes.shape({
        filename: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        large: React.PropTypes.shape({ url: React.PropTypes.string.isRequired }).isRequired,
        medium: React.PropTypes.shape({ url: React.PropTypes.string.isRequired }).isRequired,
        small: React.PropTypes.shape({ url: React.PropTypes.string.isRequired }).isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const { attachment } = this.props;
    // large.url will be null on non-image assets (like PDF)
    const url = (
      attachment.asset.large != null ?
        attachment.asset.large.url : undefined
    ) || attachment.asset.url;

    const copypaste = `<img src="${url}" alt="">`;
    return (
      <div className="attachment with-image">
        <img className="preview" src={attachment.asset.url} />
        <textarea value={copypaste} readOnly={true} className="copypaste" />
      </div>
    );
  }
}

export default Attachment;
