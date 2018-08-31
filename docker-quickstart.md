# Docker Quickstart

## Install

Follow the installation instructions for
[docker](https://docs.docker.com/install/) and
[docker-compose](https://docs.docker.com/compose/install/)

(docker-compose may or may not come with docker on your platform)

## Dependencies

the following projects must be separtely cloned and run for this project to work:

[openstax/hypothesis-server](https://github.com/openstax/hypothesis-server)

[openstax/tutor-server](https://github.com/openstax/tutor-server)

## Run

``` bash
docker-compose up
```

the js files will be served at `http://localhost:8000`

the ui is available through the tutor-server project at `http://localhost:3001`
