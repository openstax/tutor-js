import React from 'react';
import S from './string';
import { isObject, map } from 'lodash';

export
function toList(obj) {
    return (
        <ul>{map(obj, (v, k) => (
            <li key={k}>{S.titleize(k)}: {isObject(v) ? toList(v) : String(v)}</li>
        ))}</ul>
    );
}

export
function titleize(obj) {
    return S.toSentence(
        map(obj, (v, k) => `${S.titleize(k)} ${isObject(v) ? titleize(v) : String(v)}`),
    );
}
