FROM node:16-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./next.config.js .
COPY package.json package-lock.json ./ 
COPY ./public ./public
COPY --chown=nextjs:nodejs ./.next/standalone ./
COPY --chown=nextjs:nodejs ./.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]