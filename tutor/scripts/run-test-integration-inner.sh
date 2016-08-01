# There is probably a better way to do this, but here's a start.
#
# Initially I tried using `parallelshell` with `npm start` + the following script, and then tried `parallelshell` with `webpack-dev-server` + the following script, and then gave up and ran `npm run build` first followed by `http-server . & mocha ...`
#
# ```
# # scripts/wait-and-run-selenium.sh
# echo 'Waiting 5sec for webpack to start up' && \
# sleep 5 && \
# echo 'Waiting for webpack to start serving the JS file' && \
# curl http://localhost:8000/dist/tutor.js > /dev/null && \
# echo 'Starting Selenium' && \
# mocha -R spec ./test-integration/
# ```
#
# 1. `npm start` did not work because `gulp` would keep serving files even after <kbd>Ctrl</kbd>+<kbd>C</kbd> was pressed
# 1. `webpack-dev-server` did not seem to work because I tried going to `http://localhost:8000` and the HTML & JS would load but for some reason it would not start up.
#
# Then, I realized we could build the production version (without the minification) beforehand, and then run `http-server` to start up a simple webserver. Also, npm will run the `preXYZ` script before running `XYZ`.

npm run test-integration:only && (exit 42)
