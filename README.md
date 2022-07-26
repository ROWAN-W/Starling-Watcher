### API Path

| Methods | Urls | Actions | Error Response |
| ---------- | ------- | -------- |----------|
| POST | /design/images | get images list from dokcerhub ||
| Post | /design/users | add a new user ||
| Put | /design/users/{id} | update the information of a user ||
| POST | /design/templating | do templating and deploy user's designs to Kubernetes| 400: Deploy fail ||
| Get | /design/users | get id and name of all users || 
| Get | /design/initialize | delete all users in database and insert three sample users(test only) ||
| Get | /design/database | show all information of users in database(test only) ||
| Get | /design/nodes | List all the avtive nodes in the cluster | 404: Kubernetes API fail |
| Get | /monitor/nodes | List all the avtive nodes in the cluster for monitor page | 404: Kubernetes API fail |
| Post | /design/upload (with multipart file as body) | upload and deploy yaml file | 404: invalid yaml file/fail to deploy |
| Post | /login | user login, get access token and refresh token | |
| Get | /refresh | refresh access token, get new access token and old refresh token | |
| DELETE | /monitor/restart/{namespace}/{podName} | restar a certain pod in a certain namespace | 404: Kubernetes API fail |




### script:
#### start minikube
`minikube start `
#### check that there's no deployment named 'nginx'
`kubectl get deployments`
#### upload sample.yaml to this API and check that a pod named 'nginx' is up
`kubectl get deploymnets`

