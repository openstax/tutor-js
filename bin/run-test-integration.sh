# If you are testing locally then start up a http server and run the selenium tests.
# If you are testing against a remote server then no need to start up a http server locally.
if [ -z ${SERVER_URL} ]
then
  echo "Testing locally. If you want to test a remote server then set the SERVER_URL environment variable"

  parallelshell --verbose "http-server --silent -p 8000 ." "./bin/run-test-integration-inner.sh"

else
  echo "Testing against remote server ${SERVER_URL}"
  # Starting up in parallelshell anyway just so Ctrl+C still works nicely
  parallelshell "./bin/run-test-integration-inner.sh"
fi

# run-test-integration-inner.sh returns 42 if successful
if [ $? -eq 42 ]
then
  exit 0
else
  exit $?
fi
