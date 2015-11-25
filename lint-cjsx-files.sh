
for FILE in $(find ./src/ -name '*.cjsx')
do
  ./node_modules/.bin/cjsx-transform ${FILE} | ./node_modules/.bin/coffee --compile --stdio > ${FILE}.js
  ./node_modules/.bin/eslint --no-ignore ${FILE}.js
  rm ${FILE}.js
done
