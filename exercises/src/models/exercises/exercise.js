import { last, map, filter, find, reduce } from 'lodash';
import { computed, action, observable } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from 'shared/model';

import SharedExercise from 'shared/model/exercise';

@identifiedBy('exercises/exercise')
export default class Exercise extends SharedExercise {

  @session error;

  @action deleteAttachment(attachment) {
    this.attachments.remove(attachment);
    return {
      exerciseId: this.uid,
      attachmentId: attachment.id,
      query: { filename: attachment.asset.filename },
    };
  }

  @action onAttachmentDelete() {}

  @action onError({ message }) {
    this.error = message;
  }
}
