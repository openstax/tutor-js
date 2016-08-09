#!/bin/bash

# Check that there are no added console.log messages

# If OX_PROJECT is set then only check that project
if [ -n "${OX_PROJECT}" ];
then
  SOURCE_PATH=${OX_PROJECT}
else
  SOURCE_PATH="**"
fi

# MESSAGES=$(grep -r -E 'console.(warn|log|info|dir)' ./${SOURCE_PATH}/src/)
MESSAGES=$(grep -r -E 'console.(log|info|dir)' ./${SOURCE_PATH}/src/)
ALERTS=$(grep -r -E 'alert' ./${SOURCE_PATH}/src/)

COUNT=$(echo ${MESSAGES} | wc -w)
if [ "${COUNT}" -gt 0 ];
then
  echo "${MESSAGES}"
  # exit 1
fi
