#!/bin/bash

set -e

git checkout gh-pages

git pull origin gh-pages

git merge master -m 'merge master in prep for release'

npm install

gulp release

echo "Done with build, git commit and/or tag and push to complete"
