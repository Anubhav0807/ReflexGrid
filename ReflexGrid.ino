const int n = 3;
const int m = 4;

int prev_i = -1;
int prev_j = -1;

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
  int i, j;

  do {
    i = random(0, n);
    j = random(0, n);
  } while (i == prev_i && j == prev_j);
  
  digitalWrite(laserMatrix[i][j], HIGH);
  delay(500);
  digitalWrite(laserMatrix[i][j], LOW);

  prev_i = i;
  prev_j = j;
}
