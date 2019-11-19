//const int buzzer = 9; //buzzer to arduino pin 9
byte inByte; 
 
const int buzzerPin = 9;

int counter = 0;

void setup(){
  Serial.begin(9600); 
  pinMode(buzzerPin, OUTPUT); // Set buzzer - pin 9 as an output
  noTone(9);
}

void loop(){
  if (Serial.available() > 0) { // If there's serial data available
   inByte = Serial.read(); // Read it
   Serial.write(inByte); // send it back out as raw binary data
   if (inByte != 0) {
    tone(9, 1000);
    delay(100 - inByte);
   }
   else if (inByte == 0){
    noTone(9); 
   }
  }
}
