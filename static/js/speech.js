class Speech {
  constructor() {
    // Sentences set
    this.mode = "chat";  //"guard"
    this.guard_status = "untrigger";
    this.originquestions = new Array("I am a robot.",
                                     "how are you doing?", 
                                     "it's Great!",
                                     "cheer up.",
                                     "why are you silent?",
                                     "I cannot get your saying",
                                     "the guard mode is turned on",
                                     "is at your front door",
                                     "welcome back home",
                                     "good",
                                     "bad",
                                     "turn on",
                                     "I am monitoring");
    this.questions = this.originquestions.slice(0);
    this.splitChar = "@";
    this.qindex = 0;

    // Subtitle and QA    
    this.textDiv = document.getElementById("subtitle");
    this.chat_status = "begin";
    this.waitTime = 0;

    this.peopleName = new Array();

    // Grammar elements
    var grammar = "#JSGF V1.0; grammar emar; public <greeting> = hello | hi; <person> = maya | alisa;";
    this.recognition = new window.webkitSpeechRecognition();
    var recognitionList = new window.webkitSpeechGrammarList();
    this.recognizing = false;

    // Set the recogniton elements
    recognitionList.addFromString(grammar, 1);
    this.recognition.grammars = recognitionList;
    this.recognition.continuous = true;
    this.recognition.lang = "en";
    this.recognition.interimResults = false;
    this.recognition.i = 1;

    // Set the listener functions and keep running function
    this.recognition.onresult = this.processSpeech.bind(this);
    this.recognition.onend = this.recognitionEnded.bind(this);

    // Google language API
    this.baseUrl = "https://translation.googleapis.com/language/translate/v2";
    this.APIKey = "AIzaSyBttL3_rUfMaP8vZQazT8bCd5XhHkmR4lA";
    this.currentlang = "en";
    this.xhttp = null;

    // Speak
    this.msg = new SpeechSynthesisUtterance();
	//this.voices = window.speechSynthesis.getVoices();
    this.msg.voiceURI = 'native';
    this.msg.volume = 0.8; // 0 to 1
    this.msg.rate = 1; // 0.1 to 10
    this.msg.pitch = 0.5; //0 to 2
    this.msg.onstart = this.handleSpeakStart.bind(this);
    this.msg.onend = this.handleSpeakEnd.bind(this);
  }  

  // Check the satus of the talk
  checkStatus() {
    if(this.mode == "chat") {
        // Check the this.status of dialog
        if(this.chat_status == "begin") {
          this.textDiv.innerHTML = "<br>"
          this.chat_status = "checking";
        }
        else if(this.chat_status == "checking") {
          console.log(this.peopleName.indexOf("Bowen"))
          if(this.peopleName.indexOf("Bowen") > -1) {
            this.chat_status = "asking";
            this.waitTime = 0;
            this.textDiv.innerHTML = "Bowen, " + this.questions[1];
            // Speak the problem
            this.speak(this.textDiv.innerHTML, this.currentlang);
          }
        }
        else if(this.chat_status == "waiting") {
          this.waitTime += 1;
          if(this.waitTime > 4) {
            this.recognitionEnded();
            this.chat_status = "looking for"
            this.textDiv.innerHTML = "Bowen, "+ this.questions[4];
            this.speak(this.textDiv.innerHTML, this.currentlang);
          }
        }
    }
    else if(this.mode == "guard") 
    {
      if(this.peopleName.length == 0) 
      {
        this.textDiv.innerHTML = this.questions[12];
      }
      else 
      {
        console.log(this.guard_status);
        if(this.guard_status == "untrigger") {
          this.guard_status = "trigger"
          var tmp_name_list = ""
          for(var i = 0; i < this.peopleName.length; i++) {
            tmp_name_list += this.peopleName[i] + ", ";
          }

          if(this.peopleName.indexOf("Bowen") > -1) {
            this.textDiv.innerHTML = tmp_name_list + this.questions[8];
            this.speak(this.textDiv.innerHTML, this.currentlang);
          }
          else {
            this.textDiv.innerHTML = tmp_name_list + this.questions[7];
            this.speak(this.textDiv.innerHTML, this.currentlang);
          }
        }
        
      }
    }

    // Check the language and translate it
    if(document.getElementById("lang").value != this.currentlang) {
      this.currentlang = document.getElementById("lang").value;
      this.translateQuestions(); 
    }
  }

  /*Function that makes the browser speak a text*/
  speak(text, lang) {
    /*Check that your browser supports test to speech*/
    if ('speechSynthesis' in window) {

      this.msg.text = text;
      this.msg.lang = lang;

      speechSynthesis.speak(this.msg);     
    }
  }

  handleSpeakStart() {
  	face.startDrawMouthAnimation();
  }

  handleSpeakEnd() {
    face.stopDrawMouthAnimation();
    console.log("Speak End")
    if(this.chat_status == "asking") {
      this.chat_status = "waiting";
      this.startRecognition();
    }
    else if(this.chat_status == "looking for" || this.chat_status == "handeling") {
      this.chat_status = "begin";
    }   
  }

  // Start recognize the speech
  startRecognition() {
    if(!this.recognizing) {
       this.recognition.start();
       this.recognizing = true;  
    }
   }

  // Get the output of people and analyse the content
  processSpeech(event) {
    var inputSpeech = event.results[0][0].transcript;

    this.chat_status = "handeling";
    var text = ""
    if(inputSpeech.indexOf(this.questions[9]) != -1) {
      text = this.questions[2];
    }
    else if(inputSpeech.indexOf(this.questions[10]) != -1) {
      text = this.questions[3];
    }
    else if(inputSpeech.indexOf(this.questions[11]) != -1) {
      text = this.questions[6];
      this.mode = "guard";
      this.chat_status = "begin";
    }
    else {
      text = this.questions[5];
    }
    
    this.textDiv.innerHTML = "Bowen, " + text;
    this.speak(this.textDiv.innerHTML, this.currentlang);

    this.recognitionEnded();
  }

  // Stop the recognize process
  recognitionEnded() {
    if(this.recognizing) {
      this.recognizing = false;
      this.recognition.stop();
    }
  }

  // Load the language list
  loadTargetLanguate() {
    this.ajaxRequest("GET", this.baseUrl + "/languages?key=" + this.APIKey, this.handleHTTPResponse.bind(this, 0), 1);
  }

  // Translate the default language to another
  translateQuestions() { 
    var text = "";
    for(var i = 0; i < this.originquestions.length; i++)
      text += this.splitChar + this.originquestions[i]; 
    var content = {
      "q": text,
      "target": this.currentlang
    };
    console.log(text);
    // Use POST request, and use JSON to covert the object to a JSON string
    this.ajaxRequest("POST", this.baseUrl + "?key=" + this.APIKey, this.handleHTTPResponse.bind(this, 1), JSON.stringify(content));
  }

  /*Function that handles the response from the web service request*/
  handleHTTPResponse(handleMode) {
    if (this.successfulRequest(this.xhttp)) {
      if(handleMode == 0) {
        // Mode 1 means to load the language list
        var news = JSON.parse(this.xhttp.responseText).data.languages;
        var languateChoose = document.getElementById("lang");
        for(var i = 0; i < news.length; i++) {
          languateChoose.innerHTML += "<option>" + news[i].language + "</option>";
        }
        document.getElementById("lang").value = "en";
      }
      else if(handleMode == 1) {
        // Mode 0 means to translate the language.
        var wholeText = JSON.parse(this.xhttp.responseText).data.translations[0].translatedText;
        var text = wholeText.split(wholeText[0]);
        console.log(text);
        for(var i = 0; i < this.originquestions.length; i++) 
          this.questions[i] = text[i + 1];
        this.textDiv.innerHTML = this.questions[this.qindex];
      }
    }
    else {
      console.log("waiting Connecting");
    }
  }

  /*Helper function: sends an XMLHTTP request*/
  ajaxRequest(method, url, handlerFunction, content) {
    this.xhttp = new XMLHttpRequest();
    this.xhttp.open(method, url);
    this.xhttp.onreadystatechange = handlerFunction;
    if (method == "POST") {
      this.xhttp.send(content);
    }
    else {
      this.xhttp.send();
    }
  }

  /*Helper function: checks if the response to the request is ready to process*/
  successfulRequest(request) {
    return request.readyState === 4 && request.status == 200;
  }

  updateName(names) {
    if(this.peopleName.length != names.length || this.peopleName[0] != names[0]) {
      this.peopleName = names;
      this.guard_status = "untrigger";
    }
  }
}


let speech = new Speech();
speech.loadTargetLanguate();
window.setInterval(speech.checkStatus.bind(speech), 2000);
