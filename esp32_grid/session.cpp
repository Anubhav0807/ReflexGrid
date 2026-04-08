#include <Arduino.h>
#include <ArduinoJson.h>
#include <vector>

#include "buzzer.h"
#include "comm.h"
#include "laser_matrix.h"
#include "http_client.h"

int score;
int timer;
int sessionDuration;
int cooldownDuration;
bool running = false;
bool waiting = false;
unsigned long timeStamp;
unsigned long scoreTimeStamp;
std::vector<unsigned long> responseTime;

void sessionStart() {
  waiting = false;
  turnOffLasers();

  // Get the duration of the session
  sendMessage("Fetching user\npreferences...\n");
  String payload = httpGet("/api/esp32/config");
  StaticJsonDocument<256> doc;

  if (deserializeJson(doc, payload)) {
    // default fallback values
    sessionDuration = 60;
    cooldownDuration = 0;
  } else {
    sessionDuration = doc["sessionDuration"];
    cooldownDuration = doc["cooldownDuration"];
  }

  sendMessage("Get Ready!\nStarting in 3...\n");
  beep(100);
  delay(900);
  sendMessage("Get Ready!\nStarting in 2...\n");
  beep(100);
  delay(900);
  sendMessage("Get Ready!\nStarting in 1...\n");
  beep(100);
  delay(900);

  score = 0;
  timer = sessionDuration;
  responseTime.clear();
  timeStamp = millis();
  scoreTimeStamp = millis();
  sendSessionState(timer, score);
  running = true;
  nextPoint();
};

void sessionEnd() {
  running = false;
  turnOffLasers();
  beep(500);

  unsigned long totalResponseTime = 0;
  for (size_t i = 0; i < responseTime.size(); i++) {
    totalResponseTime += responseTime[i];
  }

  int avgResponseTime = totalResponseTime / responseTime.size();
  sendSessionResult(avgResponseTime);

  String json = "{";
  json += "\"score\":" + String(score) + ",";
  json += "\"sessionDuration\":" + String(sessionDuration) + ",";
  json += "\"cooldownDuration\":" + String(cooldownDuration) + ",";
  json += "\"avgResponseTime\":" + String(avgResponseTime) + ",";
  json += "\"responseTime\":[";

  for (size_t i = 0; i < responseTime.size(); i++) {
    json += String(responseTime[i]);
    if (i < responseTime.size() - 1) {
      json += ",";
    }
  }

  json += "]}";
  String payload = httpPost("/api/esp32/save-session-result", json);

  delay(2000);
  askForNewSession();
  promptYesNo();
  waiting = true;
}

void updateTimer() {
  if (!running) return;
  unsigned long curTimeStamp = millis();
  if (curTimeStamp - timeStamp >= 1000) {
    timer--;
    timeStamp += 1000;
    sendSessionState(timer, score);

    if (timer == 0) {
      sessionEnd();
    }
  }
}

void updateScore() {
  if (!running) return;
  score++;
  unsigned long curTimeStamp = millis();
  responseTime.push_back(curTimeStamp - scoreTimeStamp);
  turnOffCurrentLaser();
  sendSessionState(timer, score);
  delay(cooldownDuration);
  scoreTimeStamp = millis();
  nextPoint();
}

bool isRunning() {
  return running;
}

bool isWaiting() {
  return waiting;
}

void welcomeUser() {
  sendMessage("Welcome,\nto Reflex Grid\n");
  delay(2000);
  sessionStart();
}

void farewellUser() {
  waiting = false;
  turnOffLasers();
  sendMessage("Stay responsive\nBye Bye...\n");
}