var courseSeconds = 0;
var slideSeconds = 0;

var isCourseTimerActive = false;
var isSlideTimerActive = false; 

window.setInterval( () => {
    if (isCourseTimerActive === true) {
        courseSeconds += 1
    }
    if (isSlideTimerActive === true) {
        slideSeconds += 1
    }
}, 1000);

const manageTimer = {
    "course": {
        "start": () => {isCourseTimerActive = true},
        "stop": () => {isCourseTimerActive = false},
        "reset": () => {courseSeconds = 0}
    },
    "slide": {
        "start": () => {isSlideTimerActive = true},
        "stop": () => {isSlideTimerActive = false},
        "reset": () => {slideSeconds = 0}
    }
}

const conf = {
  "endpoint": "https://thracelabs-learnxapi.lrs.io/xapi/",
  "auth": "Basic " + toBase64("acoruc:najoma")
}
ADL.XAPIWrapper.changeConfig(conf); 

function sendViewed(object, objectId) {
  const player = GetPlayer();
  const uNamejs = player.GetVar("uName");
  const uEmailjs = player.GetVar("uEmail");

  const statement = {
    "actor": {
      "name": uNamejs,
      "mbox": "mailto:" + uEmailjs 
    },
    "verb": {
      "id": "http://id.tincanapi.com/verb/viewed",
      "display": { "en-us": "viewed" }
    },
    "object": {
      "id": objectId,
      "definition": {
        "name": { "en-us": object },
        "description": {"en-us": "Resource within course sample"},
        "type": "http://id.tincanapi.com/activitytype/resource"
      },
      "objectType": "Activity"
    }
  }
  const result = ADL.XAPIWrapper.sendStatement(statement);
}

function sendAnswered(object, objectId, responseVar, success){
  const player = GetPlayer();
  const uNamejs = player.GetVar("uName");
  const uEmailjs = player.GetVar("uEmail");
  const userResponse = player.GetVar(responseVar);
  const userScorejs = player.GetVar("userScore");
  const maxScorejs = player.GetVar("maxScore");
  const scaledScore = userScorejs / maxScorejs;
  let finalDuration = convertToIso(slideSeconds);
  
  const statement = {
    "actor": {
      "name": uNamejs,
      "mbox": "mailto:" + uEmailjs 
    },
    "verb": {
      "id": "http://adlnet.gov/expapi/verbs/answered",
      "display": { "en-us": "asnwered" }
    },
    "object": {
      "id": objectId,
      "definition": {
        "name": { "en-us": object },
        "description": {"en-us": "Question in course sample"},
        "type": "http://adlnet.gov/expapi/activities/question"
      },
      "objectType": "Activity"
    },
    "result": {
      "duration": finalDuration,
      "response": userResponse,
      "score": {
        "min": 0,
        "max": maxScorejs,
        "raw": userScorejs,
        "scaled": scaledScore
      },
      "sucess": success
    }	
  }
  const result = ADL.XAPIWrapper.sendStatement(statement);

}

function sendPassed(object, objectId){
  const player = GetPlayer();
  const uNamejs = player.GetVar("uName");
  const uEmailjs = player.GetVar("uEmail");
  const userScorejs = player.GetVar("userScore");
  const maxScorejs = player.GetVar("maxScore");
  const scaledScore = userScorejs / maxScorejs;
  let finalDuration = convertToIso(slideSeconds);
  
  const statement = {
    "actor": {
      "name": uNamejs,
      "mbox": "mailto:" + uEmailjs 
    },
    "verb": {
      "id": "http://adlnet.gov/expapi/verbs/passed",
      "display": { "en-us": "passed" }
    },
    "object": {
      "id": objectId,
      "definition": {
        "name": { "en-us": object },
        "description": {"en-us": "Question in Sample Course"},
        "type": "http://adlnet.gov/expapi/activities/assessment"
      },
      "objectType": "Activity"
    },
    "result": {
      "duration": finalDuration,
      "score": {
        "min": 0,
        "max": maxScorejs,
        "raw": userScorejs,
        "scaled": scaledScore
      },
      "sucess": true
    }	
  }
  const result = ADL.XAPIWrapper.sendStatement(statement);
}

function sendFailed(object, objectId){
  const player = GetPlayer();
  const uNamejs = player.GetVar("uName");
  const uEmailjs = player.GetVar("uEmail");
  const userScorejs = player.GetVar("userScore");
  const maxScorejs = player.GetVar("maxScore");
  const scaledScore = userScorejs / maxScorejs;
  let finalDuration = convertToIso(slideSeconds);
  
  const statement = {
    "actor": {
      "name": uNamejs,
      "mbox": "mailto:" + uEmailjs 
    },
    "verb": {
      "id": "http://adlnet.gov/expapi/verbs/failed",
      "display": { "en-us": "failed" }
    },
    "object": {
      "id": objectId,
      "definition": {
        "name": { "en-us": object },
        "description": {"en-us": "Question in Sample Course"},
        "type": "http://adlnet.gov/expapi/activities/assessment"
      },
      "objectType": "Activity"
    },
    "result": {
      "duration": finalDuration,
      "score": {
        "min": 0,
        "max": maxScorejs,
        "raw": userScorejs,
        "scaled": scaledScore
      },
      "sucess": false
    }	
  }
  const result = ADL.XAPIWrapper.sendStatement(statement);
}

function convertToIso(secondsVar) {
  let seconds = secondsVar;
  if (seconds > 60) {
    if (seconds > 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      seconds = (seconds % 3600) % 60;
      return `PT${hours}H${minutes}M${seconds}S`;
    } else {
      const minutes = Math.floor(seconds / 60);
      seconds %= 60;
      return `PT${minutes}M${seconds}S`;
    }
  } else {
    return `PT${seconds}S`;
  }
}