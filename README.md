# Reflex Grid

A rehabilitation-oriented reflex training system built using an **ESP32** with an **Arduino UNO–driven LCD display**.
The ESP32 activates lasers across a **3×4 grid**, creating visual targets for the user. During therapy sessions, the patient touches the corresponding sensor when a laser appears. The system records the response, moves the target to a new position, updates the score, and sends the session data to the UNO, which displays the current time and performance metrics on a **16×2 LCD**.

The system is designed to support **hand-eye coordination training and response-time recovery**, making it suitable as a low-cost interactive tool for **upper-limb rehabilitation and physiotherapy exercises**, particularly for patients recovering from fractures or reduced motor responsiveness.

## Gotchas & Debugging Notes

### 1. Floating Inputs (Major Bug Source)

Using:
```
pinMode(pin, INPUT);
```
causes **floating inputs**, which can randomly read HIGH or LOW.

When the Arduino UNO powered on, the shared ground introduced small voltage changes, causing multiple false triggers.

Fix:
```
pinMode(pin, INPUT_PULLDOWN);
```

This ensures the pin defaults to LOW unless actively driven HIGH.

---

### 2. Arduino Serial Upload Conflict

Arduino UNO uses **pins 0 and 1 for USB upload**.

If ESP32 TX remains connected during upload, the upload may fail.

Solution:

Disconnect the wire from **UNO RX (pin 0)** before uploading.

---

### 3. LCD Serial Parsing

LCD updates occur when a newline `\n` is received.

```
if (ch == '\n') {
  lcd.setCursor(0, lineNum);
  lcd.print(message);
}
```

Ensure each message line ends with `\n`, don't use Serial.println() because it appends a `\r\n` (carriage return + newline).

---
