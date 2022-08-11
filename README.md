# Starling Watcher
Welcome to the Starling Watcher!
[Starling Watcher](https://github.com/ROWAN-W/SummerProject) is a kubernetes Dashboard design for [StarlingUAS](https://docs.starlinguas.dev/)!

## Features
- User Account Login.
- Deploy pods through web interaction, no need for users to write yaml files.
- Deploy pods by uploading yaml.
- Get image list based on dockerhub repository name.
- Monitor the operation of the cluster's node, pod, container, and other resources.
- Support for opening container shells and logs on the web.
- Support resize web shell and logs.
- Support restart pod and delete pod by project name.

## Example
### Design Page
![alt design](./picture/design.png)
### Monitor Page
![alt monitor](./picture/monitor.png)


## To start using Starling Watcher
1. [Installation](https://github.com/ROWAN-W/SummerProject/wiki/Installation)
- Before running the software, you need to install [docker](https://www.docker.com/) and [kubernetes](https://kubernetes.io/), Starling Watcher has been uploaded to dockerhub. users do not need to clone, just use the kubectl command to run [Aerial-Robotics-System-deploy.yaml](https://github.com/ROWAN-W/SummerProject/blob/main/Aerial-Robotics-System-deploy.yaml).
`kubectl create namespace starlingui-aerial-robotics-system`
`kubectl apply -f Aerial-Robotics-System-deploy.yaml -n starlingui-aerial-robotics-system`
- To run the simulation cluster locally you can use：
    - [Kind](https://kind.sigs.k8s.io/)
    - [minikube](https://minikube.sigs.k8s.io/docs/start/)
2. [Demo](https://github.com/ROWAN-W/SummerProject/wiki/Demo)
3. [REST APIs](https://github.com/ROWAN-W/SummerProject/wiki/APIs)
### API Path

| Methods | Urls | Actions | Error Response |
| ---------- | ------- | -------- |----------|
| POST | /design/image | get images list from dokcerhub |
| POST | /design/upload (with multipart file as body) | upload and deploy yaml file | 404: invalid yaml file/kubernetes server error/File Processing Error/Empty file |
| POST | /design/templating | do templating and deploy user's designs to Kubernetes| 400: Deploy fail |
| POST | /design/projects | save a project in the dataabse | 403: invalid project style, missing some keys |
| PUT | /design/users/{id} | update the information of a user | 403: User to be updated does not exist or invalid old password |
| PUT | /design/projects/{id} | update a project | 403: can not find the project by given id or updated project style is not valid |
| GET | /design/users | get id and name of all users | - |
| GET | /design/initialize | delete all users in database and insert three sample users(test only) | - |
| GET | /design/database | show all information of users in database(test only) | - |
| GET | /design/nodes | List all the avtive nodes in the cluster | 404: Kubernetes API fail |
| GET | /design/projects | get all projects in the database | - |
| DELETE | /design/projects/{id} | delete a project | 403: can not find the project by given id |
| DELETE | /monitor/restart/{namespace}/{podName} | restar a certain pod in a certain namespace | 404: Kubernetes API fail |
| GET | /monitor/nodes | List all the avtive nodes in the cluster for monitor page | 404: Kubernetes API fail |
| DELETE | /monitor/delete/{namespace}| delete a certain project from cluster| 404: Unable to delete the project |
| GET | /monitor/namespaces | get the project name (namepsace) | 404: Kubernetes API fail |
| POST | /login | user login, get access token and refresh token | 401: username or password not valid |
| POST | /register | add a new user | 403: username already exist in database |
| GET | /refresh | refresh access token, get new access token and old refresh token | 401: invalid refresh token |
4. [FAQ](https://github.com/ROWAN-W/SummerProject/wiki/FAQ)

## Support
If you need support, start with checking whether you're hitting known issues. If that doesn't work, please open an issue to describe the cases. Additionally, before you file an issue, please search existing issues to see if your issue is already covered.


