FROM node:10.9-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    gcc \
    git \
    python2.7 \
  && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python2.7 /usr/bin/python2
