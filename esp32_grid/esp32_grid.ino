#include "laser_matrix.h"
#include "sensors.h"
#include "session.h"
#include "buzzer.h"
#include "comm.h"

void setup() {
  laserInit();
  sensorInit();
  buzzerInit();
  commInit();

  welcomeUser();  
}

void loop() {
  if (isRunning()) {
    if (isCurrentPointTouched()) {
      beep();         // buzzer feedback
      nextPoint();    // move laser
      updateScore();  // increment score
    }

    updateTimer();

  } else if (isWaiting()) {
    scanYesNo();
  }
}