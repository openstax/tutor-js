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
  loading.querySelector('h3').innerText = "OpenStax Tutor failed to load.  Please check your internet connection and retry";
  loading.querySelector('.staxly-animation').className = 'staxly-animation paused';
}, 30000);
</script>
`;
const styleTags = sheet.getStyleTags();

console.log(styleTags, html); // eslint-disable-line no-console
