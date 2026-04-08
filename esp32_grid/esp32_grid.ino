#include "laser_matrix.h"
#include "sensors.h"
#include "session.h"
#include "buzzer.h"
#include "comm.h"
#include "http_client.h"

void setup() {
  laserInit();
  sensorInit();
  buzzerInit();
  commInit();
  httpInit();

  welcomeUser();
}

void loop() {
  if (isRunning()) {
    if (isCurrentPointTouched()) {
      beep();         // buzzer feedback
      updateScore();  // increment score
    }

    updateTimer();

  } else if (isWaiting()) {
    scanYesNo();
  }
}