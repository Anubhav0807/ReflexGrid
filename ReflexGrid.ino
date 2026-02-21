const int n = 3;
const int m = 4;

int i = -1;
int j = -1;
int prev_i = -1;
int prev_j = -1;

int laserMatrix[n][m] = {
  { 21, 23, 15, 16 },
  { 19, 22, 2, 17 },
  { 18, 12, 4, 5 }
};

int sensorRow[n] = { 25, 26, 27 };
int sensorCol[m] = { 32, 33, 34, 35 };

void nextPoint() {
  if (i >= 0 && j >= 0) {
    digitalWrite(laserMatrix[i][j], LOW);
  }

  do {
    i = random(0, n);
    j = random(0, m);
  } while (i == prev_i && j == prev_j);

  prev_i = i;
  prev_j = j;

  digitalWrite(laserMatrix[i][j], HIGH);
}

void setup() {
  // Set all laser pins as OUTPUT
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
      pinMode(laserMatrix[i][j], OUTPUT);
    }
  }

  // Set all sensor pins as INPUT
  for (int i = 0; i < n; i++) {
    pinMode(sensorRow[i], INPUT);
  }
  for (int i = 0; i < m; i++) {
    pinMode(sensorCol[i], INPUT);
  }

  randomSeed(esp_random());
  nextPoint();
}

void loop() {
  if (digitalRead(sensorRow[i]) == HIGH && digitalRead(sensorCol[j]) == HIGH) {
    nextPoint();
  }
}
