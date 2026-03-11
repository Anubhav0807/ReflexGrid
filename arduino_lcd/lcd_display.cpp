#include <Arduino.h>
#include <LiquidCrystal.h>

// Connect VDD to 5V
// Connect VSS, V0, RW and K to GND
const int rs = 2, en = 3, d4 = 4, d5 = 5, d6 = 6, d7 = 7;
const int backlight = 9;  // Connect to pin A of LCD

LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

String message = "";
int lineNum = 0;

void lcdInit() {
  analogWrite(backlight, 50);
  lcd.begin(16, 2);
}

void readSerialAndDisplay() {
  while (Serial.available()) {
    char ch = Serial.read();
    if (ch == '\n') {
      if (lineNum == 0) lcd.clear();
      lcd.setCursor(0, lineNum);
      lcd.print(message);
      message = "";
      lineNum = 1 - lineNum;
    } else {
      message += ch;
    }
  }
}