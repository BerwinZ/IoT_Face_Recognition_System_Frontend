class Communicate {
    // Initialize Firebase
    constructor() {
       this.detect_url = "http://127.0.0.1:8081/detect"
       this.save_url = "http://127.0.0.1:8081/save"
      //this.url = "https://assignment2-facerec.appspot.com/detect"
    }

    /*Helper function: sends an XMLHTTP request*/
    ajaxRequest(method, url, content, handleFunction) {
      var xhttp = new XMLHttpRequest();
      xhttp.open(method, url);
      xhttp.onreadystatechange = handleFunction;
      if(method == "POST")
        xhttp.send(content);
      else
        xhttp.send();
    }

    detect(img_data) {
      if (img_data != null) {
        var sendData = {"img": img_data};
        this.ajaxRequest("POST", this.detect_url, JSON.stringify(sendData), this.onRecieveDetectAns);
      }
      else {
        console.log("An image has not yet been captured.");
      }
    }

    onRecieveDetectAns() {
      if(this.responseText != null) {
        if(this.responseText == "") {
          camera.updateSquare([0, 0, 0, 0])
        }
        else {
          var news = JSON.parse(this.responseText);
          if(news["face_pos"].length > 0)
            face.updatePupilsPosition(news["face_pos"][0])

          camera.updateSquare(news["face_pos"]);
        }
      }
    }

    recognize() {
      this.ajaxRequest("GET", this.detect_url, 1, this.onRecieveRecAns);
    }

    onRecieveRecAns() {
      if(this.responseText != null) {
        if(this.responseText == "") {

        }
        else {
          var news = JSON.parse(this.responseText);
          speech.updateName(news["face_name"]);
          console.log(news["face_name"])
        }
      }
    }

    save(name, img_data) {
      if(name != "" && img_data != null) {
        var sendData = {"img": img_data,
                        "name": name,
                        "mode": "add"};
        this.ajaxRequest("POST", this.save_url, JSON.stringify(sendData), this.onRecieveSaveRemoveAns);
      }
    }

    remove(name) {
      if(name != "") {
        var sendData = {"name": name,
                        "mode": "remove"};
        this.ajaxRequest("POST", this.save_url, JSON.stringify(sendData), this.onRecieveSaveRemoveAns);
      }
    }

    onRecieveSaveRemoveAns() {
      if(this.responseText != null && this.responseText != "") {
        console.log(this.responseText);
      }
    }
}

let communicate = new Communicate()
