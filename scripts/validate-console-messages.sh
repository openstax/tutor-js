#!/bin/bash

# Check that there are no added console.log messages

MESSAGES=""
MESSAGES="${MESSAGES}$(grep 'console\.log' -R ./tutor/src/)"
MESSAGES="${MESSAGES}$(grep 'console\.info' -R ./tutor/src/)"
# MESSAGES="${MESSAGES}$(grep 'console\.warn' -R ./tutor/src/)"
# MESSAGES="${MESSAGES}$(grep 'alert' -R ./tutor/src/)"

MESSAGES="${MESSAGES}$(grep 'console\.log' -R ./exercises/src/)"
MESSAGES="${MESSAGES}$(grep 'console\.info' -R ./exercises/src/)"
MESSAGES="${MESSAGES}$(grep 'console\.warn' -R ./exercises/src/)"
MESSAGES="${MESSAGES}$(grep 'alert' -R ./exercises/src/)"

MESSAGES="${MESSAGES}$(grep 'console\.log' -R ./shared/src/)"
MESSAGES="${MESSAGES}$(grep 'console\.info' -R ./shared/src/)"
MESSAGES="${MESSAGES}$(grep 'console\.warn' -R ./shared/src/)"
MESSAGES="${MESSAGES}$(grep 'alert' -R ./shared/src/)"

if [ "$(echo ${MESSAGES} | wc -w)" -gt 0 ];
then
  echo "${MESSAGES}"
  # echo "Words found: $(echo ${MESSAGES} | wc -w)"
  exit 1
fi
