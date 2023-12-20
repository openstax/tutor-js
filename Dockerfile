FROM node:18-slim as base

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    gcc \
    git \
    curl \
    # Additional packages required by python build
    zlib1g \
    zlib1g-dev \
    libssl-dev \
    libbz2-dev \
    libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/* 

FROM base as builder

ENV PATH=/root/.pyenv/bin:$PATH
RUN curl https://pyenv.run | bash \
  && eval "$(pyenv virtualenv-init -)" \
  && pyenv install 2.7 \
  && ln -s /root/.pyenv/shims/python /usr/bin/python


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
