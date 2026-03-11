#include <Arduino.h>

#define RXD2 14
#define TXD2 13

void commInit() {
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
}

void sendSessionState(int remainingTime, int curScore) {
  Serial2.print("Time: ");
  if (remainingTime < 10) Serial2.print(" ");
  Serial2.print(remainingTime);
  Serial2.print("s\nScore: ");
  if (curScore < 10) Serial2.print(" ");
  Serial2.print(curScore);
  Serial2.print("\n");
}

void sendSessionResult(int responseTime) {
  Serial2.print("Time Up!");
  Serial2.print("\nRes Time: ");
  Serial2.print(responseTime);
  Serial2.print("ms\n");
}

void sendMessage(String message) {
  Serial2.print(message);
}

void askForNewSession() {
  Serial2.print(" Play again?\n");
  Serial2.print(" [No]     [Yes] \n");
}