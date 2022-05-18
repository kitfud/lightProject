#include <List.hpp>
#include <Adafruit_NeoPixel.h>
#include <SimpleWebSerial.h>
SimpleWebSerial WebSerial;

#ifdef AVR
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

#define LED_PIN    6

#define LED_COUNT 100

// Declare our NeoPixel strip object:
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

String color;
String lastColor;
String colorData[3];

void setup() {
WebSerial.on("paymentMade", handlePayment);
#if defined(AVR_ATtiny85) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
#endif
  // END of Trinket-specific code.
 Serial.begin(57600);
  strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
  strip.show();            // Turn OFF all pixels ASAP
  strip.setBrightness(50); // Set BRIGHTNESS to about 1/5 (max = 255)
}

void handlePayment(JSONVar data) {
 color = data;
}

void processColor(){
    int commaCount = 0;
    String StringRed;
    String StringGreen;
    String StringBlue;
  for (int i = 0; i <= color.length(); i++) {

    if(color[i]==','){
      commaCount++;
      continue;
    }

    if(commaCount ==0){
     StringRed += color[i];
    }
    if (commaCount ==1){
     StringGreen +=color[i];
    }
    if (commaCount ==2){
     StringBlue +=color[i];
    }
  }

  int red = StringRed.toInt();
  int green = StringGreen.toInt();
  int blue = StringBlue.toInt();

  colorWipe(strip.Color(red,   green,   blue)); 

  Serial.print(red);
  Serial.print(green);
  Serial.println(blue);
}

void loop() {
WebSerial.check();
Serial.println(color);
delay(10);
while (color != lastColor){
  lastColor = color;
  processColor();
}

}



void colorWipe(uint32_t color) {
  for(int i=0; i<strip.numPixels(); i++) { // For each pixel in strip...
    strip.setPixelColor(i, color);         //  Set pixel's color (in RAM)
    strip.show();                          //  Update strip to match

  }
}