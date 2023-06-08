FROM    node  AS builder
RUN     mkdir /my-app
WORKDIR /my-app
ARG     GIT_REPOSITORY_ADDRESS
RUN     git clone $GIT_REPOSITORY_ADDRESS
RUN     mv ./tetris-react/* ./
RUN     npm install -s
RUN     npm run --silent build

FROM    nginx AS runtime
COPY    --from=builder /my-app/build/ /usr/share/nginx/html/
RUN     rm /etc/nginx/conf.d/default.conf
COPY    ./nginx.conf /etc/nginx/conf.d                    
CMD     ["nginx", "-g", "daemon off;"]
