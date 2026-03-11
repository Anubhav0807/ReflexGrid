#include "lcd_display.h"

void setup() {
  Serial.begin(9600);
  lcdInit();
}

void loop() {
  readSerialAndDisplay();
}