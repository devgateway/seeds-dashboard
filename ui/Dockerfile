FROM node:12.16.3 AS wp-react-lib
COPY wp-react-lib /tmp/ui/wp-react-lib
WORKDIR /tmp/ui/wp-react-lib
COPY .env ./
RUN npm install && npm run dist

FROM node:12.16.3 AS compiler
WORKDIR /tmp/ui
COPY --from=wp-react-lib /tmp/ui/wp-react-lib  /tmp/ui/wp-react-lib
COPY package*.json ./
COPY .env ./
RUN npm install
RUN npm rebuild node-sass
COPY public ./public/
COPY src ./src/
RUN npm run build \
  && tar -C build -czf /tmp/ui.tgz .

FROM alpine:latest
COPY --from=compiler /tmp/ui.tgz /usr/src/ui.tgz
COPY update.sh /usr/local/bin
VOLUME /var/www/ui
RUN chmod +x /usr/local/bin/update.sh
CMD ["/usr/local/bin/update.sh"]
