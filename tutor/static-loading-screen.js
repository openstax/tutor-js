import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import Loading from '../shared/src/components/loading-animation';

const sheet = new ServerStyleSheet();
const html = renderToString(
  sheet.collectStyles(
    <Loading className="boot-splash-screen" />
  )
) + `
<script>
setTimeout(function() {
  var loading = document.querySelector('.boot-splash-screen');
  if (!loading) { return; }

  var container = loading.parentNode;
  var error = document.createElement('h1');
  error.style.textAlign = 'center'
  error.innerHTML = 'Unable to load OpenStax Tutor';

  container.appendChild(error);
  container.removeChild(loading);

}, 30000);
</script>
`;
const styleTags = sheet.getStyleTags();

console.log(styleTags, html); // eslint-disable-line no-console
