# Home Assistance Robot UI
This is the interfaces of the robots. It is a web based robot face designed to help people program their smart homes easily. 

This robot uses the web server, which can be found [here](https://github.com/BerwinZ/Home-Assistance-Robot/tree/webserver)

## Function
### Chat Mode
* In this chat mode, when the robot detects the known faces, it will great the users and listen to users' speaking and give feedback finally.
* There will be nothing when it doesn't detect the existing faces. 
* When the robot is talking, there will be audio output and text feedback.

### Guard Mode
* When in the guarding mode, the robot will say `I am monitoring` when there is no person.
* It it can detects the faces, it shows the names, otherwise it shows `Stranger`
* The eyes of the robots will follow the face's position. It is still work well when you drag or zoom the broswer.

### Animation
* The robots eyes will follow your face positions no matter what size and what position of your browser.
* The eyes will blink.
* Robot has mouth animation when she is talking.
* Robot will remind users when they block the camera.


### Face Detection

## Install
### Detection Web Server
Go to [here](https://github.com/BerwinZ/Home-Assistance-Robot/tree/webserver) to finish the deployment of the web server of the detection module.

### Main Module
You can open the website locally or use Flask to deploy it to google app engine.
   

## How to use
When you open the web page, you can click the button `open camera`, then you can input your name, and save your faces to database or deltect faces exisitng in database.


## Structure and Parameters
* speech.js  
handle the speaking movement and main logic of what the robot will talk.

* robotface.js  
renderer the faces'animation of the robot, including static face, moving pupils, blink animation and mouth animation.

* communicate.js  
handle the HTTP POST and HTTP GET with the web server.

* camera.js
handle the web camera and renderer of the detection result.