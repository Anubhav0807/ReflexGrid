#include <Arduino.h>

#define BUZZER_PIN 21

void buzzerInit() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void beep(int duration) {
  analogWrite(BUZZER_PIN, 30);
  delay(duration);
  analogWrite(BUZZER_PIN, 0);
}