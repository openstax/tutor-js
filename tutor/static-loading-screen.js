import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import Loading from '../shared/src/components/loading-animation';

const sheet = new ServerStyleSheet();
const styleTags = sheet.getStyleTags();

const html = renderToString(
  <StyleSheetManager sheet={sheet.instance}>
    <Loading className="boot-splash-screen" />
  </StyleSheetManager>
) + `

setTimeout(function() {
  var loading = document.querySelector('.boot-splash-screen');
  if (!loading) { return; }

  var container = loading.parentNode;
  var error = document.createElement('h1');
  error.style.textAlign = 'center'
  error.innerHTML = 'Unable to load OpenStax Tutor, please retry';
  container.appendChild(error);
  container.removeChild(loading);

}, 30000); // 30 seconds

`;

console.log(styleTags, html); // eslint-disable-line no-console
