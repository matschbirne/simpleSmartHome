#!/usr/bin/python2.7

          
      
import time
import serial


ser = serial.Serial(
  
   port='/dev/ttyUSB0',
   baudrate = 9600,
   parity=serial.PARITY_NONE,
   stopbits=serial.STOPBITS_ONE,
   bytesize=serial.EIGHTBITS,
   timeout=0.1
)
counter=0


while 1:
	print "."
	ser.write([1,1])
	time.sleep(0.2)
	counter += 1

	rcv = ser.read(10)
	print "rec:" + repr(rcv)
	#time.sleep(1)