import serial
import sys
from time import sleep

#TODO: buffer fuer states

NUM_CHANELS = 4

ser = serial.Serial(
   port='/dev/ttyUSB0',
   baudrate = 9600,
   parity=serial.PARITY_NONE,
   stopbits=serial.STOPBITS_ONE,
   bytesize=serial.EIGHTBITS,
   timeout=0.02
)

def serialrequest(cmd):
	print "SERIAL REQUEST:",repr(cmd)
	ser.write(cmd)
	#sleep(0.01)
	try:
		read_value = ser.read(1)
		print "Read:",read_value
		read_value = ord(read_value)
		return read_value
	except:
		print "Error"
		return -1

# serial functions
def socket_on(addr):
	cmd =[int(addr),1]
	return serialrequest(cmd)
	
def socket_off(addr):
	cmd =[int(addr),0]
	return serialrequest(cmd)

def socket_get_state(addr):
	cmd =[int(addr)]
	return serialrequest(cmd)

def socket_toggle(addr):
	if (socket_get_state(addr) == 0):
		return socket_on(addr)
	else:
		return socket_off(addr)

if __name__ == "__main__":
	action = sys.argv[1]
	addr = sys.argv[2]
	res = "unknown action"

	if action == "on":
		res = socket_on(addr)
	elif action == "off":
		res = socket_off(addr)
	elif action == "toggle":
		res = socket_toggle(addr)
	elif action == "get":
		res = socket_get_state(addr)
	
	print "Result: ",res