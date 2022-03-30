# Aerial Robotics - Group A

## Structure

<table>
  <tr>
    <th>Back End</th>
    <th colspan="2">Front End</th>
  </tr>
  <tr>
    <th colspan="2"><strong>Server</strong></th>
    <th><strong>Browser</strong></th>
  </tr>
  <tr>
    <th><strong>JAVA/GO</strong></th>
    <th><strong>NODE.JS<strong></th>
    <th><strong>HTML+JS+CSS<strong></th>
  </tr>
  <tr>
    <td>
    <p>Service Layer</p>
    <p>Provide data interface</p>
    <p>Maintaining data stability</p>
    <p>Encapsulating business logic</p>
    </td>
    <td>
    <p>JS running on the server</p>
    <p>Forwarding data, streaming services</p>
    <p>Control Logic</p>
    <p>Render pages to optimize the experience</p>
    </td>
    <td>
    <p>JS running on the browser</p>
    <p>CSS, JS loaded and running</p>
    <p>DOM manipulation</p>
    <p>REACT</p>
    <p>General templates</p>
    </td>
  </tr>
</table>
      
### DEMO
<img src="https://github.com/ROWAN-W/SummerProject/blob/main/demo.png" width="70%">

### Main Requirement: 
* (Efficient and massive) Deployment of Dockers on drones 
* Simplify the user interface of the existing system (Kubernetes). Less clickings. No more interaction through terminal 
* Client is expecting "drop and drag interface"
* keep an account for users (not for security but for personal convenience)

### Second Requirement: 
* Status of drones (power on/off) and status control

### Main Task:
* Study: ***Kubernetes API***
* design and imlement our own API 
* Build a web (additional layer) on Kubernetes with ***Simple and clean user interface***. 
* Connect our web to our ***API***

### Project Status:
* ***Mickey*** (First degree in Computer Science)  and ***Robert*** will be the only users for the starting stage of the project. 
* The project targets drone-users with no computer science knowledge => They have no idea of what Docker, Kuburnates are. 

### Side Note:
* Abstraction of Docker achieves hardware independent *no need to consider drone as a special hardware(? we might need some drone specific feature) 

## Resources

Video call recording:<https://drive.google.com/file/d/1gCEmzW42qQJaTW5Al0gWTD9zdOxYF7VK/view?usp=sharing>

Here is the Kubernetes Dashboard API, divided into backend and frontend. The easiest way might be to look directly at the page they are currently using, open the dev tool to see which API is actually used, and then come back to this GitHub to study the usage

Home page:<https://github.com/kubernetes/dashboard>

API page:<https://github.com/kubernetes/dashboard/tree/master/src/app>

### Records of email for reference
* So the github organisation StarlingUAS provides <https://github.com/StarlingUAS> contains all of the projects involved in the system. In particular either the ProjectStarling or Murmuration projects will be using your outcomes. The system uses kubernetes (and by extension docker) so reading up on those systems will be beneficial. In particular we are looking for you to produce a more speicifc version of the kuberenets dashboard <https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard> which is what we currently use. It is an extended goal, but you guys can also read a little about ROS2 as well <https://docs.ros.org/en/foxy/index.html>
* 1. I am currently building an easy to use way for you guys to run all of this, which should hopefully be done in the next two weeks which I will release for you to use! This uses kind <https://kind.sigs.k8s.io/docs/user/quick-start>.
  2. We also have some slightly old, but hopefully good for context, documentation of our system here: <https://docs.starlinguas.dev/guide/multiple-drone-local-machine>
  3. Learning the kubernetes/containerisation concepts would be a good starting point for our discussion with you guys. 
* Language / Framework is up to you. Your system requirement is that it need to communicate with the Kubernetes api and be extensible. Our suggestion is ***ReactJS*** although we are happy to see what you come up with.
* Work division and by extension project management is your task. I suggest we come to an understanding on requirements first, then you guys can decide on who does what. 

## HCI evaluation
* Starting point : interview with Mickey and Robert, field trip (observation) to lab(requirement, compare to the old system,try the CLI of k8s that Mickey built )
* Questionnaire for unprofessional drone users
* Actual user evaluation (prototype, interview, observation)
---
* **core user**
* **possible user we can interview**
* **will the project be used by public or just with in the lab**
* **development environment**
---

## Questions:
1. Target user profile ? 
2. Scalability ? ***possible user we can interview***
3. will the project be used by public or just with in the lab
4. development environment
5. Are the drone commercial or built in lab
6. What is the exact process of deployment on drones?
---

## How to Divide Work? (3/29 discussion)
1. First stage: Everyone agrees on draft features/layout of the website => the most obvious marking point
   *"web accessibility" might be a strong plus in marking comparing to fancy UI 
   
2. Proposal (deadline: 5/1)
(1)Front-end: Evan, Yulin => ***React*** framwork => might be devided into main dashboard page (fetching from Kubernetes) and user setting page (fetching from database), will include responsive design
(2)Back-end: Rowan, Oshia, Pench => might be devided into K8s studying, API and database building

3. We are suggested to use ***Express.js*** to build our API (wrap Kubernetes API, pay attention to the quality of API design which must be intuitive and close to natural language)\

4. ***Node.js***  is recommanded for the back-end, Some might be in favor of ***Golang*** which is more type-strict. Also consider that TA has more experience in Node.js.
->Might be a good idea that all of us take some time go through the tutorial and discuss next week.
<img src="https://github.com/ROWAN-W/SummerProject/blob/main/structure_sample.jpeg" width="70%">

<https://docs.google.com/document/d/1XD38Y7_Qh-EGPpgBfbo9n7XeQuZsez-1S_5RAFQ7KT8/edit>
