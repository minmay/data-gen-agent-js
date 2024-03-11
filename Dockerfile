FROM node:20.11.0-slim
# minikube image build . -t me.mvillalobos/data-gen-agent:latest
WORKDIR /opt/data-gen-agent
COPY package.json .
RUN npm install
RUN mkdir conf
COPY conf/tags.yaml ./conf/
COPY src/ .

CMD [ "node", "app.js" ]
