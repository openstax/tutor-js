import { get, last } from 'lodash';
import { ExercisesMap, Exercise } from '../models/exercises';
import Search from '../models/search';
import Adapter from './adapter';

const {
    connectModelUpdate, connectModelRead,
} = Adapter;

const start = function() {

    connectModelRead(Search, 'perform', {
        pattern: 'exercises',
        onSuccess: 'onComplete',
    });

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

export default {
    start,
};
