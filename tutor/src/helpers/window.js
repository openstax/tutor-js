export default {
  replaceBrowserLocation(url) {
    if (!window.__karma__) { return window.location.replace(url); }
  },
};
