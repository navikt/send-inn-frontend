FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci

ADD . /app/

RUN npm run build

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]
