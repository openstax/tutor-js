import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';

@observer
class Attachment extends React.Component {
  static propTypes = {
    attachment: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { attachment } = this.props;

    const copypaste = `<img src="${attachment.url}" alt="">`;
    return (
      <div className="attachment with-image">
        <img className="preview" src={attachment.url} />
        <textarea value={copypaste} readOnly={true} className="copypaste" />
      </div>
    );
  }
}

export default Attachment;
