#include <Arduino.h>
#include "laser_matrix.h"
#include "session.h"

const int n = 3;
const int m = 4;

const int sensorRow[n] = { 25, 26, 27 };
const int sensorCol[m] = { 32, 33, 34, 35 };

void sensorInit() {
  // Set all sensor pins as INPUT_PULLDOWN
  for (int i = 0; i < n; i++) {
    pinMode(sensorRow[i], INPUT_PULLDOWN);
  }
  for (int i = 0; i < m; i++) {
    pinMode(sensorCol[i], INPUT_PULLDOWN);
  }
}

bool isCurrentPointTouched() {
  int r = getCurrentRow();
  int c = getCurrentCol();

  return digitalRead(sensorRow[r]) == HIGH && digitalRead(sensorCol[c]) == HIGH;
}

void scanYesNo() {
  if (digitalRead(sensorRow[1]) == HIGH && digitalRead(sensorCol[2]) == HIGH) {
    sessionStart();
  } else if (digitalRead(sensorRow[1]) == HIGH && digitalRead(sensorCol[1]) == HIGH) {
    farewellUser();
  }
}