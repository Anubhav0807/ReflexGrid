#include <Arduino.h>
#include "buzzer.h"
#include "comm.h"
#include "laser_matrix.h"

#define SESSION_DURATION 60

int score;
int timer;
bool running = false;
bool waiting = false;
unsigned long timeStamp;

void sessionStart() {
  waiting = false;
  turnOffLasers();

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
  timer = SESSION_DURATION;
  timeStamp = millis();
  sendSessionState(timer, score);
  running = true;
  nextPoint();
};

void sessionEnd() {
  running = false;
  turnOffLasers();
  beep(500);

  int responseTime;
  if (score > 0) {
    responseTime = (SESSION_DURATION * 1000) / score;
  } else {
    responseTime = -1;
  }

  sendSessionResult(responseTime);
  delay(3000);
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
  sendSessionState(timer, score);
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
  beep(100);
}