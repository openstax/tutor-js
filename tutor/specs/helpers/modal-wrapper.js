import { ReactWrapper } from 'enzyme';
import { Modal } from 'react-bootstrap';

export function getModalInstance(component) {
    const modal = component.find(Modal);
    return modal.node._modal.dialog;
}

export function wrapModalContents(component) {
    return new ReactWrapper(
        getModalInstance(component), true
    );
}
