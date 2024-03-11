# Data Gen Agent
This application is an agent that generates CSV time-series into an Apache Kafka topic. It is handy
for implementing stream programming applications.
## Quickstart
```shell
npm run start -- -h
Usage: app [options]

Options:
  -d, --dry-run                Performs a dry run by not send messages to Kafka. (env: DRY_RUN)
  -t --tags <string>           Location of tags configuration file. (env: TAGS)
  --kafka-brokers <string...>  List of Kafka brokers. (default: ["data-gen-agent-kafka-bootstrap:9092"], env: KAFKA_BROKERS)
  --kafka-client-id <string>   Kafka producer client id. (default: "data-gen-agent", env: KAFKA_CLIENT_ID)
  --kafka-topic <string>       Kafka topic. (default: "timeseries", env: KAFKA_TOPIC)
  -l, --loop <int>             Number of milliseconds to wait between invocations. (default: 30000 miliseconds, env: LOOP_MS)
  -h, --help                   Displays help information
```

The tags.yaml file defines which tags to stream to kafka.
The sample contents below are annotated.
```yaml
selection:
  numeric: 2                        # Select two numeric tags. Use type string or double.
  string: 2                         # Select two string tags. Use type string.
  groups: 1                         # select one group tag.
tags:
  - name: pu136mod-ni-001           # Name of the tag
    type: int                       # Tag type. Use int, double, or string.
    fn: return 100 * Math.sin(v)    # Provide a custom function or identity.
  - name: pu136mod-ni-002
    type: int
    fn: identity
  - name: pu136mod-ni-003
    type: int
    fn: identity
  - name: pu136mod-ni-004
    type: int
    fn: identity
  - name: pu136mod-ns-021
    type: string
    fn: identity
  - name: pu136mod-ns-022
    type: string
    fn: identity
  - name: pu136mod-ns-023
    type: string
    fn: identity
  - name: pu136mod-ns-024
    type: string
    fn: identity
groups:
  - ["pu136mod-ni-001", "pu136mod-ns-021"]    # Group tags by name
  - ["pu136mod-ni-002", "pu136mod-ns-022"]
  - ["pu136mod-ni-003", "pu136mod-ns-023"]
  - ["pu136mod-ni-004", "pu136mod-ns-024"]
```

Notice that tags can support custom functions written in JavaScript.
Take a look at the tag definition with the name ` pu136mod-ni-001` and its function defined as
expression `return 100 * Math.sin(v)`.  It only supports expressions with the variable `v`.

It is internally implemented with a Function object. Below is a snippet of the source code.
Thus, this supports whatever JavaScript supports. For now, `return <expression>` expressions are sufficient.
```javascript
const fn = new Function("v", tag.fn);
return fn(value);
```

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




