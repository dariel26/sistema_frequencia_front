FROM node:20-alpine
WORKDIR /usr/src/app
COPY . ./
RUN yarn && yarn build
EXPOSE 3000
CMD ["yarn", "start"]