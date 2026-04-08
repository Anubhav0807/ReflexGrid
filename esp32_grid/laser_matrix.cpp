#include <Arduino.h>

const int n = 3;
const int m = 4;

int i = -1, j = -1;
int prev_i = -1, prev_j = -1;

const int laserMatrix[n][m] = {
  { 1, 23, 15, 16 },
  { 19, 22, 2, 17 },
  { 18, 12, 4, 5 }
};

void laserInit() {
  // Set all laser pins as OUTPUT
  for (int r = 0; r < n; r++) {
    for (int c = 0; c < m; c++) {
      pinMode(laserMatrix[r][c], OUTPUT);
    }
  }

  randomSeed(esp_random());
}

void nextPoint() {
  do {
    i = random(0, n);
    j = random(0, m);
  } while (i == prev_i && j == prev_j);

  prev_i = i;
  prev_j = j;

  digitalWrite(laserMatrix[i][j], HIGH);
}

int getCurrentRow() {
  return i;
}
int getCurrentCol() {
  return j;
}

void turnOffCurrentLaser() {
  if (i >= 0 && j >= 0)
    digitalWrite(laserMatrix[i][j], LOW);
}

void turnOffLasers() {
  for (int r = 0; r < n; r++) {
    for (int c = 0; c < m; c++) {
      digitalWrite(laserMatrix[r][c], LOW);
    }
  }
}

void promptYesNo() {
  digitalWrite(laserMatrix[1][1], HIGH);
  digitalWrite(laserMatrix[1][2], HIGH);
}