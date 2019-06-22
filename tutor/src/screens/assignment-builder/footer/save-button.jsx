import { React, PropTypes, observer } from '../../../helpers/react';
import TourAnchor from '../../../components/tours/anchor';
import { AsyncButton } from 'shared';

const MESSAGES = {
  publish: {
    action: 'Publish',
    waiting: 'Publishing…',
  },
  save: {
    action: 'Save',
    waiting: 'Saving…',
  },
};

const SaveButton = observer(({ ux, ux: { plan } }) => {
  const text = MESSAGES[plan.isPublished ? 'save' : 'publish'];
  return (
    <TourAnchor id="builder-save-button">
      <AsyncButton
        variant="primary"
        className="publish"
        isWaiting={ux.isSaving}
        onClick={ux.onSave}
        waitingText={text.waiting}
      >
        {text.action}
      </AsyncButton>
    </TourAnchor>
  );
});
SaveButton.displayName = 'SaveButton';
SaveButton.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default SaveButton;

// export default class SaveTaskButton extends React.Component {
//
//   static propTypes = {
//     onSave: PropTypes.func.isRequired,
//     onPublish: PropTypes.func.isRequired,
//     isEditable:   PropTypes.bool.isRequired,
//     isSaving:     PropTypes.bool.isRequired,
//     isWaiting:    PropTypes.bool.isRequired,
//     isPublished:  PropTypes.bool.isRequired,
//     isPublishing: PropTypes.bool.isRequired,
//     hasError:     PropTypes.bool.isRequired,
//     isFailed:     PropTypes.bool.isRequired,
//   }
//
//   render() {
//     if (!this.props.isEditable) { return null; }
//
//     const { isPublished } = this.props;
//
//     const isBusy = isPublished ?
//       this.props.isWaiting && (this.props.isSaving || this.props.isPublishing)
//       :
//       this.props.isWaiting && this.props.isPublishing;
//
//     const Text = isPublished ? MESSAGES.save : MESSAGES.publish;
//
//     const additionalProps = OXLink.filterProps(
//       omit(this.props, 'onSave', 'onPublish', 'isEditable', 'isSaving', 'isWaiting', 'isPublished', 'isPublishing', 'hasError')
//       , { prefixes: 'bs' });
//
//     return (
//       <AsyncButton
//         isJob={true}
//         variant="primary"
//         className="-publish publish"
//         onClick={isPublished ? this.props.onSave : this.props.onPublish}
//         waitingText={Text.waiting}
//         isFailed={this.props.isFailed}
//         disabled={this.props.hasError || this.props.isWaiting || this.props.isSaving}
//         isWaiting={isBusy}
//         {...additionalProps}>
//         {Text.action}
//       </AsyncButton>
//     );
//   }
// }
