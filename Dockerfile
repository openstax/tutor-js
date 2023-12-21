FROM debian:bookworm-slim as base

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    gcc \
    git \
    curl \
  && rm -rf /var/lib/apt/lists/*

FROM base as builder
ENV NODE_VERSION=12.22.12
ENV NVM_DIR="/root/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
  && . $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default \
  && npm install -g yarn

ENV NODE_PATH=$NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

FROM builder as build
ARG PUBLIC_PATH

COPY . /code
WORKDIR /code
RUN yarn && yarn build tutor

FROM build as ui-testing

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

FROM nginx as serve

COPY --from=build /code/tutor/dist/. /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
