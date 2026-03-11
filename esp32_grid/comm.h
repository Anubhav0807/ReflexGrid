#pragma once

void commInit();
void sendSessionState(int remainingTime, int curScore);
void sendSessionResult(int responseTime);
void sendMessage(String message);
void askForNewSession();