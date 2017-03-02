for FILE in $(find ./shared/src/ ./tutor/src/ ./exercises/src/ -name '*.cjsx')
do
  $(npm bin)/cjsx-transform ${FILE} | $(npm bin)/coffee --compile --stdio > ${FILE}.js
  $(npm bin)/eslint --no-ignore ${FILE}.js
  rm ${FILE}.js
done
