class Face {
  constructor() {
  	// Basic elements
  	var distanceFromCenterX = 120;
  	this.eyeRadius = 40;
  	this.pupilsRadius = 15;
  	this.circleY = 150;
  	this.circleX = new Array(200 - distanceFromCenterX, 200 + distanceFromCenterX);

  	// Get the this.canvas related objects
  	this.canvas = document.getElementById("faceCanvas");
  	this.ctx = document.getElementById("faceCanvas").getContext("2d");
    this.canvas_img = document.getElementById("cameraCanvas");

  	// Blink Elemetns
  	this.blinkFrameNum = 3;
  	this.blinkCnt = 0;
  	this.blinkMode = "Add";
  	this.blinkInterval = -20;

  	// Mouth Elements
  	this.mouthAngle = 2; 
  	this.mouthMode = "Add";
  	this.drawMouthAniFlag = false;
  	this.drawMouthTimes = 0;

  	// Mouse position and pupils' position
  	this.mouseX = 0;
  	this.mouseY = 0;
  	this.pupilsLongestMove = 18;
  	this.scaleDistanceK = 0.05;
  	this.ncircleX = this.circleX.slice(0);
  	this.ncircleY = new Array(this.circleY, this.circleY);

    this.eyebrowMode = "happy";
  }

  // The main draw function
  draw() {
    // Clear the previous images
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw eyes and pubils again
    this.drawEyePupils();
    // Draw mouse
    this.drawMouth();  
    // Draw the blink animation
    this.drawBlinkAnimation();
    // Draw the moutch animation
    this.drawMouthAnimation();
    // Draw the eyebrow
    this.drawEyebrow();
  }

  // Draw the static eyes and pupils
  drawEyePupils() {
      for(var i = 0; i < 2; i++) {
        this.drawCircle(this.circleX[i], this.circleY, "black", this.eyeRadius);
        this.drawCircle(this.ncircleX[i], this.ncircleY[i], "white", this.pupilsRadius);
    }
  }

  // Draw the outline of mouth
  drawMouth()
  {
    this.ctx.save()
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(200, 230, 30, Math.PI * 1 / 16, Math.PI * 15 / 16);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }

  // Draw the blink animation
  drawBlinkAnimation() {
    // Change the this.blinkCnt
    this.blinkCnt = (this.blinkMode == "Add")? this.blinkCnt + 1 : this.blinkCnt - 1;
    // Draw blink
    if(this.blinkCnt >= 0)
      this.drawOnceBlink();

    // Set the this.blinkCnt
    if(this.blinkCnt >= this.blinkFrameNum) {
      this.blinkMode = "Dec";
    }
    else if(this.blinkCnt <= this.blinkInterval) {
      this.blinkInterval = -20 * (Math.random() * 5 + 1);
      this.blinkMode = "Add";
      this.blinkCnt = 0;
    }
  }

  // Handle the blink animation
  drawOnceBlink() {
    this.ctx.save();
    this.ctx.fillStyle="white";
    for(var i = 0; i < 2; i++) {
      this.ctx.beginPath();
      this.ctx.rect(this.circleX[i] - this.eyeRadius, 
                    this.circleY + this.eyeRadius * (this.blinkCnt / this.blinkFrameNum - 2), 
                    this.eyeRadius * 2, 
                    this.eyeRadius);
      this.ctx.fill();
      
      this.ctx.beginPath();
      this.ctx.rect(this.circleX[i] - this.eyeRadius, 
                    this.circleY + this.eyeRadius * (1 - this.blinkCnt / this.blinkFrameNum), 
                    this.eyeRadius * 2, 
                    this.eyeRadius);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  // Start
  startDrawMouthAnimation() {
    this.drawMouthAniFlag = true;
  }

  // Stop
  stopDrawMouthAnimation() {
    this.drawMouthAniFlag = false;
  }

  // Move the mouse to a proper position
  drawMouthAnimation() 
  { 
    if(this.drawMouthAniFlag) {
      // Change the mouth angle
      this.mouthAngle = (this.mouthMode == "Add")? this.mouthAngle + 2: this.mouthAngle - 2;
      
      // Draw the new mouth
      this.ctx.save()
      this.ctx.fillStyle = "red";
      this.ctx.beginPath();
      this.ctx.arc(200, 230, 29, Math.PI * 1 / this.mouthAngle, Math.PI * (1 - 1 / this.mouthAngle));
      this.ctx.fill();
      this.ctx.restore();

      // Change the mouth mode
      if(this.mouthAngle >= 10) {
          this.mouthMode = "Dec";
      }  
      else if(this.mouthAngle <= 2) {
          this.mouthMode = "Add";
      }
    }
  }

  drawEyebrow() 
  {
    if(this.eyebrowMode == "happy") {
      var tmpy = 135;
      var range = new Array(Math.PI * 21 / 16, Math.PI * 27 / 16);
    }
    else if(this.eyebrowMode == "sad") {
      var tmpy = 8;
      var range = new Array(Math.PI * 5 / 16, Math.PI * 11 / 16)
    }

    this.ctx.save()
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.circleX[0], tmpy, 80, range[0], range[1]);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();

    this.ctx.save()
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.circleX[1], tmpy, 80, range[0], range[1]);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();

  }

  // Basic drawing function
  drawCircle(centerX, centerY, color, radius)
  {
    this.ctx.save()
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
    this.ctx.fill();
    this.ctx.restore();
  }


  handleMouse(event) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.updatePupilsPosition();
  }

  handleMouseOut(event) {
    this.ncircleX[0] = this.circleX[0]
    this.ncircleX[1] = this.circleX[1];
    this.ncircleY[0] = this.circleY;
    this.ncircleY[1] = this.circleY;
  }

  // updatePupilsPosition()
  // {
  //   // Convert the mouse position to the position in the this.canvas
  //   var mouseConvertX = this.mouseX - this.rect.left * (this.canvas.width / this.rect.width);
  //   var mouseConvertY = this.mouseY - this.rect.top * (this.canvas.height / this.rect.height);
      
  //   // Draw the two pupils
  //   for(var i = 0; i < 2; i++) {
  //     // Canculate the vector and the distance from mouse to circle
  //     var vector = new Array(mouseConvertX - this.circleX[i], mouseConvertY - this.circleY);
  //     var distance = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
      
  //     // Canculate the real distance of moving
  //     var moveDistance = Math.min(this.pupilsLongestMove, this.scaleDistanceK * distance);
      
  //     // Canculate the new this.circleX and this.circleY
  //     this.ncircleX[i] = this.circleX[i] + vector[0] / distance * moveDistance;
  //     this.ncircleY[i] = this.circleY + vector[1] / distance * moveDistance;
  //   }

  updatePupilsPosition(news)
  {
    var top = news[0];
    var left = news[1];
    var bottom = news[2];
    var right = news[3];

    var face_x = (left + right) / 2;
    var face_y = (top + bottom) / 2;

    var y_offset = -200;
    face_x = (1 - face_x / this.canvas_img.width) * window.screen.width;
    face_y = (face_y / this.canvas_img.height) * window.screen.height + y_offset;

    var rect = document.getElementById("faceCanvas").getBoundingClientRect();

    // Convert the mouse position to the position in the this.canvas
    var faceConvertX = face_x - window.screenX -
                        rect.left * (this.canvas.width / rect.width);
    var faceConvertY = face_y - window.screenY - 
                        rect.top * (this.canvas.height / rect.height);
      
    // Draw the two pupils
    for(var i = 0; i < 2; i++) {
      // Canculate the vector and the distance from mouse to circle
      var vector = new Array(faceConvertX - this.circleX[i], faceConvertY - this.circleY);
      var distance = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
      
      // Canculate the real distance of moving
      var moveDistance = Math.min(this.pupilsLongestMove, this.scaleDistanceK * distance);
      
      // Canculate the new this.circleX and this.circleY
      this.ncircleX[i] = this.circleX[i] + vector[0] / distance * moveDistance;
      this.ncircleY[i] = this.circleY + vector[1] / distance * moveDistance;
    }




}

}

// Set the listener and the keep runnint function
let face = new Face(); 
// document.body.onmousemove = face.handleMouse.bind(face);
// document.body.onmouseout = face.handleMouseOut.bind(face);
window.setInterval(face.draw.bind(face), 50);



