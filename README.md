
## Design Decisions

### Libraries

This project utilizes the following libraries:

#### Commander JS
Reference: [commander.js](https://github.com/tj/commander.js#readme)

Used to parse commandline arguments.

#### YAML
Reference: [YAML](https://eemeli.org/yaml/#yaml)

Use to parse YAML configuration files.

#### CSV
Reference: [CSV](https://csv.js.org)

Used to serialize CSV data.

#### Kafka JS
Reference: [Kafka JS](https://kafka.js.org/docs/getting-started)

Used to produce Kafka messages.

#### Faker JS
Reference: [Faker JS](https://fakerjs.dev/api/)

Used to generate fake data.

#### Winston
Reference: [Winston JS](https://github.com/winstonjs/)

Used for logging.

#### Docker Node Image 
Reference: [Docker Node](https://github.com/nodejs/docker-node/blob/main/README.md#how-to-use-this-image)

Docker Node Image "node:20.11.0-slim" used to containerize this application.

## Deployment

### Deploy

Deployment for [UI for Apache Kafka](https://docs.kafka-ui.provectus.io/overview/getting-started)
and [Strimzi Kafka Operator](https://strimzi.io/quickstarts/) with [examples](https://github.com/strimzi/strimzi-kafka-operator/blob/0.39.0/examples/kafka/kafka-ephemeral.yaml)
in [data-gen-agent.yaml](./conf/data-gen-agent.yaml).

```shell
minikube start --memory=16384
minikube dashboard
```

```shell
kubectl create namespace data-gen-agent
kubectl create -f 'https://strimzi.io/install/latest?namespace=data-gen-agent' -n data-gen-agent
kubectl apply -f conf/data-gen-agent.yaml -n data-gen-agent
minikube tunnel
```
### Teardown
```shell
kubectl delete -f conf/data-gen-agent.yaml -n data-gen-agent
kubectl delete -f 'https://strimzi.io/install/latest?namespace=data-gen-agent' -n data-gen-agent
kubectl delete namespace data-gen-agent
```
### Kafka UI
First port-forward Kafka UI
```shell
kubectl port-forward pods/$(kubectl get pods -n data-gen-agent | awk '{if (match($1, /^kafka\-ui\-/) > 0){print $1}}') 58080:8080 -n data-gen-agent  
```
Then open it.
```shell
open http://localhost:58080
```
### External Kafka clients

External Kafka clients such as an IDE should use ip of `data-gen-agent-kafka-extlb-bootstrap` which
can be viewed with the following command.
```shell
kubectl get services -n data-gen-agent | awk '{if (match($1, /^data\-gen\-agent\-kafka\-extlb\-bootstrap/) > 0){print $4.":9094"}}'  
```




