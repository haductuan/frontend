# FROM node:16.17.1 as build

# RUN npm install -g npm@8.19.2

# WORKDIR /app

# COPY package*.json ./

# COPY . .

# RUN npm install

# RUN npm run build


# # prepare nginx
# FROM nginx:1.19.8-alpine

# COPY --from=build /app/build /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# ENTRYPOINT ["nginx","-g","daemon off;"]

# FROM node:16.17.0 as build

# RUN npm install -g npm@8.19.1

# WORKDIR /app

# COPY package*.json ./

# COPY . .

# RUN npm install

# EXPOSE 3000

# CMD npm start

FROM node:16.17.1 as build

RUN npm install -g npm@8.19.2 serve

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD serve -s build -p 3000
