FROM node:20-alpine3.20

RUN apk update && apk upgrade

RUN apk add tzdata && apk add shadow

RUN apk cache clean && rm -rf /var/cache/apk/*

ENV TZ=America/Guayaquil

ARG user=usrapp
ARG group=usrapp
ARG home=/home/$user

RUN groupadd -g 1337 $user && useradd -d $home -u 1337 -s /bin/sh -g $group $user

WORKDIR $home/app/

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

ENV RUN_SEED=false

RUN npm run build

RUN chown -R $user:$group $home

USER $user

CMD if [ "$RUN_SEED" = "true" ]; then npm run prisma:seed; fi && npm run start:prod

