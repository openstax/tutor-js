import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import Loading from '../shared/src/components/loading-animation';

const sheet = new ServerStyleSheet();
const html = renderToString(
  <StyleSheetManager sheet={sheet.instance}>
    <Loading className="boot-splash-screen" />
  </StyleSheetManager>
);
const styleTags = sheet.getStyleTags();

console.log(styleTags, html);
