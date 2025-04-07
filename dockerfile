FROM oven/bun:alpine

COPY ./package.json ./
RUN bun install
COPY . .

EXPOSE 3000

CMD ["bun", "index.ts"]