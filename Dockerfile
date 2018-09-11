FROM node:10.9-slim as builder

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    gcc \
    git \
    python2.7 \
  && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python2.7 /usr/bin/python2

FROM builder as build
ARG PUBLIC_PATH

COPY . /code
WORKDIR /code
RUN yarn && yarn build tutor

FROM nginx as serve

COPY --from=build /code/tutor/dist/. /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
