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
