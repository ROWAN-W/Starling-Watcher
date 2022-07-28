### API Path

| Methods | Urls | Actions | Error Response |
| ---------- | ------- | -------- |----------|
| POST | /design/images | get images list from dokcerhub ||
| PUT | /design/users/{id} | update the information of a user | 403: User to be updated does not exist or invalid old password |
| POST | /design/templating | do templating and deploy user's designs to Kubernetes| 400: Deploy fail ||
| GET | /design/users | get id and name of all users | - |
| GET | /design/initialize | delete all users in database and insert three sample users(test only) | - |
| GET | /design/database | show all information of users in database(test only) | - |
| GET | /design/nodes | List all the avtive nodes in the cluster | 404: Kubernetes API fail |
| GET | /monitor/nodes | List all the avtive nodes in the cluster for monitor page | 404: Kubernetes API fail |
| POST | /design/upload (with multipart file as body) | upload and deploy yaml file | 404: invalid yaml file/fail to deploy |
| POST | /login | user login, get access token and refresh token | 401: username or password not valid |
| POST | /register | add a new user | 403: username already exist in database |
| GET | /refresh | refresh access token, get new access token and old refresh token | 401: invalid refresh token |
| DELETE | /monitor/restart/{namespace}/{podName} | restar a certain pod in a certain namespace | 404: Kubernetes API fail |
| GET | /design/projects | get all projects in the database | - |
| POST | /design/projects | save a project in the dataabse | 403: invalid project style, missing some keys |
| PUT | /design/projects/{id} | update a project | 403: can not find the project by given id or updated project style is not valid |
| DELETE | /design/projects/{id} | delete a project | 403: can not find the project by given id |



### script:
#### start minikube
`minikube start `
#### check that there's no deployment named 'nginx'
`kubectl get deployments`
#### upload sample.yaml to this API and check that a pod named 'nginx' is up
`kubectl get deploymnets`

