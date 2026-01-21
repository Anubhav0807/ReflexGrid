const int n = 3;
const int m = 4;

int laserMatrix[n][m] = {
  {21, 23, 15, 16},
  {19, 22, 2, 17},
  {18, 33, 4, 5}
};

void setup() {
  for (int i=0; i<n; i++) {
    for (int j=0; j<m; j++) {
      pinMode(laserMatrix[i][j], OUTPUT);
    }
  }
  randomSeed(esp_random());
}

void loop() {
  int i = random(0, n);
  int j = random(0, m);
  
  digitalWrite(laserMatrix[i][j], HIGH);
  delay(500);
  digitalWrite(laserMatrix[i][j], LOW);
}
