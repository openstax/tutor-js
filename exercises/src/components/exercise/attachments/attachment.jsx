import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';

@observer
class Attachment extends React.Component {
  static propTypes = {
    attachment: PropTypes.shape({
      exercise: PropTypes.shape({
        attachments: PropTypes.array,
      }).isRequired,
      asset: PropTypes.shape({
        filename: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        large: PropTypes.shape({ url: PropTypes.string.isRequired }).isRequired,
        medium: PropTypes.shape({ url: PropTypes.string.isRequired }).isRequired,
        small: PropTypes.shape({ url: PropTypes.string.isRequired }).isRequired,
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
