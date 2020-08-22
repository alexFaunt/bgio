FROM node:14.8.0-alpine3.12

WORKDIR /usr/src/app

COPY . .

# RUN yarn install --frozen-lockfile

# This installs psql so we can do wait-for-postgres
RUN apk --no-cache add postgresql-client postgresql curl ca-certificates wget && \
  wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
  wget -q https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.27-r0/glibc-2.27-r0.apk && \
  apk add glibc-2.27-r0.apk

EXPOSE 2001
EXPOSE 35729

CMD ["yarn", "start:prod"]
