import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { Icon } from 'shared';

const Btn = styled(Icon)`

`;

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

  @action.bound onDelete() {
    this.props.attachment.exercise.attachments.remove(this.props.attachment);
  }


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
        <Btn type="trash" onClick={this.onDelete} />
        <img className="preview" src={attachment.asset.url} />
        <textarea value={copypaste} readOnly={true} className="copypaste" />
      </div>
    );
  }
}

export default Attachment;
