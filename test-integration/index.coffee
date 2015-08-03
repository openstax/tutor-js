# Runs some selenium tests that create an iReading (saves screenshot on failure).
# Mostly just playing around with Selenium to get feedback.
#
# # Instructions
#
# 1. `npm install -g mocha`
# 2. `npm install` (to get the new packages)
# 3. `mocha ./test-integration/simple.coffee --compilers coffee-script/register`
#
# TODO:
#
# - [ ] Abstract reading creation so it can be used for "Save Draft", "Publish" and partial completion

require './reading-publish'
require './ref-book-exercises'
