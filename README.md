### API Path

| Methods | Urls | Actions | Error Response |
| ---------- | ------- | -------- |----------|
| DELETE | /monitor/restart/{namespace}/{podName} | restar a certain pod in a certain namespace | 404: Kubernetes API fail |


Warning:
The delete and restart preocess takes time, if called by the front end, there need to be a waiting time of at least 2 second before the pod is successfully replce. Any other API call such as another restart or get-nodes should be made after the waiting time.
