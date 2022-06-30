### API Path

| Methods | Urls | Actions |
| ---------- | ------- | -------- |
| POST | /design/images | get images list from dokcerhub |
| Post | /design/users | add a new user |
| Put | /design/users/{id} | update the information of a user |
| POST | /design/templating | deploy user's designs to Kubernetes|
| Get | /design/users | get id and name of all users |
| Get | /design/initialize | delete all users in database and insert three sample users(test only) |
| Get | /design/database | show all information of users in database(test only) |

### Develop tools
mongoDB install  [video tutorial](https://www.youtube.com/watch?v=Ph1Z97X6xno&t=448s)--- [mongoDB Community Server](https://www.mongodb.com/try/download/community)
minikube install [minikube](https://minikube.sigs.k8s.io/docs/start/)
postman install [postman](https://www.postman.com/downloads/)
docker install [docker](https://www.docker.com/get-started/)

### IDEA devtools
![alt setting](setting1.png)
![alt setting](setting2.png)
auto compile and run

### script:
#### start 3 node
`minikube start --nodes 3 -p multinode-demo`
#### Halt the cluster:
`minikube stop`
#### Delete all of the minikube clusters:
`minikube delete --all`
#### start back end
`./mvnw spring-boot:run`
#### start front end
##### Integration Stage

Ready: image list.

Pending: User DB, Project DB, Drones, Deployment

for user db test: `npx json-server --watch data/user.json --port 8001`

for project db test: `npx json-server --watch data/project.json --port 8000`

for drones test: `npx json-server --watch data/drone.json --port 8002`


##### developing

Add new Env in advanced settings, add more info on drones (deploy)

##### pending

User features transition with ther server - server is not 100% ready 

save data to local storage (browser) - implement it later
