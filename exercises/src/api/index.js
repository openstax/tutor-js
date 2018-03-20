import { get, last } from 'lodash';
import { ExercisesMap, Exercise } from '../models/exercises';

import Adapter from './adapter';

const {
  connectModelUpdate, connectModelRead,
} = Adapter;

//
// import { ExerciseActions, ExerciseStore } from '../stores/exercise';
// import { VocabularyActions, VocabularyStore } from '../stores/vocabulary';
//
// const getIdOnly = function(id) {
//   if (id.indexOf('@') === -1) { return id; } else { return id.split('@')[0]; }
// };
//
// const getIdWithVersion = function(id, version) {
//   if (version == null) { version = 'latest'; }
//   if (id.indexOf('@') === -1) { return `${id}@${version}`; } else { return id; }
// };

const start = function() {
  // connectRead(ExerciseActions, { handleError: ExerciseStore.isMissingExercise, url(id) { return `exercises/${getIdWithVersion(id)}`; } } );

  // connectUpdate(ExerciseActions, function(id) {
  //   // backend expects the changed props and the entire exercise for some reason
  //   const obj = ExerciseStore.getChanged(id);
  //   obj.exercise = ExerciseStore.get(id);

  //   const exerciseId = getIdOnly(id);

  //   return {
  //     url: `exercises/${exerciseId}@draft`,
  //     method: 'PUT',
  //     data: obj,
  //   };
  // });

  connectModelRead(ExercisesMap, 'fetch', {
    pattern: 'exercises/{id}',
    onSuccess: 'onLoaded',
  });

  connectModelUpdate(ExercisesMap, 'publish', {
    method: 'PUT',
    pattern: 'exercises/{uid}/publish',
    onSuccess: 'onSaved',
    onFail: 'onError',
  });

  connectModelUpdate(ExercisesMap, 'saveDraft', {
    method: 'PUT',
    pattern: 'exercises/{number}@draft',
    onSuccess: 'onSaved',
    onFail: 'onError',
  });

  // connectCreate(ExerciseActions, { url: 'exercises', data: ExerciseStore.get });

  // connectModify(ExerciseActions, { trigger: 'publish', onSuccess: 'published' },
  //   id =>
  //     ({
  //       url: `exercises/${ExerciseStore.getId(id)}/publish`,
  //       data: ExerciseStore.get(id),
  //     })
  // );

  // connectDelete(ExerciseActions, { trigger: 'deleteAttachment', onSuccess: 'attachmentDeleted' },
  //   (exerciseId, attachmentFilename) =>
  //     ({
  //       url: `exercises/${getIdOnly(exerciseId)}@draft/attachments`,
  //       params: { filename: attachmentFilename },
  //     })
  // );

  // connectRead(VocabularyActions, id => ({ url: `vocab_terms/${getIdWithVersion(id, 'draft')}` }));

  // connectCreate(VocabularyActions, { url: 'vocab_terms', data: VocabularyStore.get });

  // connectUpdate(VocabularyActions, id =>
  //   ({
  //     url: `vocab_terms/${getIdOnly(id)}@draft`,
  //     data: VocabularyStore.get(id),
  //   })
  // );

  // return connectModify(VocabularyActions, { trigger: 'publish', onSuccess: 'published' },
  //   id =>
  //     ({
  //       url: `vocab_terms/${id}/publish`,
  //       data: VocabularyStore.get(id),
  //     })
  // );
};

const CSRF_TOKEN = get(document.head.querySelector('meta[name=csrf-token]'), 'content');

Exercise.prototype.uploadImage = function(image, cb) {
  const url = `/api/exercises/${this.number}@draft/attachments`;
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', req => {
    if (req.currentTarget.status === 201) {
      this.attachments.push(JSON.parse(req.target.response));
      cb({ response: last(this.attachments), progress: 100 });
    } else {
      cb({ error: req.currentTarget.statusText });
    }
  });
  xhr.addEventListener('progress', ev => cb({ progress: ((ev.total / (ev.total || image.size)) * 100) }));
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-CSRF-Token', CSRF_TOKEN);
  const form = new FormData();
  form.append('file', image, image.name);
  return xhr.send(form);
};

export default { start };
