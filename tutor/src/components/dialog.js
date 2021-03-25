import PropTypes from 'prop-types';
import React from 'react';
import { Button, Card } from 'react-bootstrap';
import TutorDialog from './tutor-dialog';
import styled from 'styled-components';
import { CloseButton } from 'shared';

const DialogContainer = styled(Card)`
  max-width: 1200px;
  margin: auto;
`;

/*
   <Dialog
   className='my-dialog-class'
   header='Dialog Title'
   confirmMsg='Are you sure you want to close?'
   isChanged={-> true}
   onCancel={-> alert 'Cancelling'}
   >
   body text
   </Dialog>
 */

export default
class Dialog extends React.Component {


    static propTypes = {
        header: PropTypes.node.isRequired,
        onCancel: PropTypes.func.isRequired,
        isChanged: PropTypes.func,
        confirmMsg: PropTypes.string,
        footer: PropTypes.node,
        cancel: PropTypes.any,
        primary: PropTypes.node,
        onPrimary: PropTypes.func,
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
    };

    onCancel = () => {
        const { isChanged, confirmMsg, onCancel } = this.props;
        if ((typeof isChanged === 'function' ? isChanged() : undefined) && confirmMsg) {
            return TutorDialog.show({
                title: 'Unsaved Changes',
                body: confirmMsg,
            }).then( () => onCancel());
        } else {
            return onCancel();
        }
    };

    render() {
        let cancelBtn;
        let { className, header, footer, primary, cancel, isChanged } = this.props;

        if (cancel) {
            cancelBtn = <Button variant="default" key="cancel" onClick={this.onCancel}>
                {cancel}
            </Button>;
        }

        if (footer || primary || cancelBtn) { footer = [primary, cancelBtn, footer]; }

        const classes = ['dialog default-dialog'];

        if (typeof isChanged === 'function' ? isChanged() : undefined) { classes.push('is-changed'); }
        if (className) { classes.push(className); }
        className = classes.join(' ');

        return (
            <DialogContainer className={className}>
                <Card.Header>
                    {header}
                    <CloseButton onClick={this.onCancel} />

                </Card.Header>
                {this.props.children}
                <Card.Footer>{footer}</Card.Footer>
            </DialogContainer>
        );
    }
}
