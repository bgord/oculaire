FROM node:6.11.3-alpine
LABEL maintainer="Jakub Pieńkowski <jakski@sealcode.org>"

ENV UID=node \
    GID=node \
    HOME=/opt/oculaire

# Tini will ensure that any orphaned processes get reaped properly.
RUN apk add --no-cache tini
RUN apk --update add imagemagick

VOLUME $HOME
WORKDIR $HOME

USER $UID:$GID

EXPOSE 8081

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/local/bin/node", "."]
