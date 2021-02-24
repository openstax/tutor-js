const ACTIVE = [];
import { find, flatten, map } from 'lodash';
import moment from 'moment';
import React from 'react';
import TutorDialog from './tutor-dialog';
import { AppStore } from '../flux/app';

const UnsavedStateMixin = {
    UNSAFE_componentWillMount() { return ACTIVE.push(this); },
    componentWillUnmount() { return ACTIVE.splice( ACTIVE.indexOf(this), 1); },
    _cannotTransition() { return (typeof this.hasUnsavedState === 'function' ? this.hasUnsavedState() : undefined); },

    _unsavedMessages() {
        return (typeof this.unsavedStateMessages === 'function' ? this.unsavedStateMessages() : undefined) ||
      [`${this.constructor.displayName} has unsaved data`];
    },
};

const TransitionAssistant = {
    canTransition() {
        return !find(ACTIVE, c => c._cannotTransition()) || (AppStore.getError() != null); },
    unsavedMessages() { return flatten( map(ACTIVE, '_unsavedMessages'), 1); },

    checkTransitionStateTo(destination) {

        return new Promise((onOk, onCancel) => {
            if (this.canTransition()) {
                return onOk();
            } else {
                const body =
          <div>
              {this.unsavedMessages().map((message, i) =>
                  <p key={i}>
                      {message}
                  </p>)}
          </div>;

                return TutorDialog.show({
                    title: `Proceed to ${destination} ?`,
                    body,
                }).then( () => {
                    this.lastCancel = moment();
                    return onOk();
                }, onCancel );
            }
        });
    },

    // transistions should be allowed for the next second if a transistion was just approved
    wasJustApproved() {
        return this.lastCancel && this.lastCancel.isBefore( moment().add(1, 'second') );
    },

    startMonitoring() {
        delete this.startMonitoring; // remove the function so it can't be called twice
    // window.onbeforeunload = () => {
    //   if (!this.canTransition() && !this.wasJustApproved()) {
    //     return this.unsavedMessages().join('\n');
    //   }
    //   return [];
    // };
    },
};

export { UnsavedStateMixin, TransitionAssistant };
