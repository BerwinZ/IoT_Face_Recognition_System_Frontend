class Camera {
  constructor() {
    this.video = document.getElementById("myVideo");
    this.canvas = document.getElementById("cameraCanvas");
    this.context = this.canvas.getContext("2d");
    this.blackThres = 10;
    this.lightTextDiv = document.getElementById("lightIndicator");
    this.frame = 100;

    this.send_cnt = 0;

    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;
    this.squareData = new Array(0);
  }

  /* This function checks and sets up the camera */
  startVideo() {
    console.log("hello");
    console.log(this);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({video: true})
        .then(this.handleUserMediaSuccess.bind(this));
    }
    window.setInterval(communicate.recognize.bind(communicate), 2000);
  }

  /* This function initiates the camera this.video */
  handleUserMediaSuccess(stream) {
    this.video.src = window.URL.createObjectURL(stream);
    this.video.play();

    /* We will capture 10 image every second */
    window.setInterval(this.captureImageFromVideo.bind(this), this.frame);
  }

  /* This function captures the this.video */
  captureImageFromVideo() {
	// Draw the images
    this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // Get the image data
    var dataObj = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var data = dataObj.data;
  	var grayImg = []

  	// Generate the gray image
  	for (var i = 0, j = 0; i < data.length; i += 4, j += 1) {
	    var gray = 0.333 * (data[i] + data[i + 1] + data[i + 2]);
	    grayImg[j] = gray;
	}
	//this.context.putImageData(dataObj, 0, 0);
    
    // Detect the light level of the image
    this.detectLightLevel(grayImg);
    
    // Send the img to database
    communicate.detect(this.canvas.toDataURL())

    // Draw the square
    this.drawSquare();
  }

  switchCamera() {}

  // Detect the level of light
  detectLightLevel(data) {
    var light = 0;
    for (var i = 0; i < data.length; i += 1) {
      light += data[i];
    }
    light /= data.length;
    
    if(light < this.blackThres)
      this.lightTextDiv.innerHTML = "Are you sure your camera is not blocked?";
    else
      this.lightTextDiv.innerHTML = Math.floor(light);
  }

  drawSquare()
  {
    for(var i = 0; i < this.squareData.length; i++) {
        var x = this.squareData[i][1];
        var y = this.squareData[i][0];
        var width = (this.squareData[i][3] - this.squareData[i][1]);
        var height = (this.squareData[i][2] - this.squareData[i][0]);

        this.context.save()
        this.context.strokeStyle = "green";
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.rect(x, y, width, height)
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    }

  }

  updateSquare(data) {
    this.squareData = data;
  }

  saveFace() {
  	name = document.getElementById("nameinput").value
    communicate.save(name, this.canvas.toDataURL());
  }

  removeFace() {
    name = document.getElementById("nameinput").value
  	communicate.remove(name)
  }
}

let camera = new Camera();
//camera.startVideo();
document.getElementById("startCamera").onclick = camera.startVideo.bind(camera);
document.getElementById("saveFace").onclick = camera.saveFace.bind(camera);
document.getElementById("removeFace").onclick = camera.removeFace.bind(camera);