parallelshell --verbose "http-server -p 8000 ." "./scripts/run-test-integration-inner.sh"

if [ $? -eq 42 ]
then
  exit 0
else
  exit $?
fi
