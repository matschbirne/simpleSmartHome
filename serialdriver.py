import serial

NUM_CHANELS = 4

ser = serial.Serial(
   port='/dev/ttyUSB0',
   baudrate = 9600,
   parity=serial.PARITY_NONE,
   stopbits=serial.STOPBITS_ONE,
   bytesize=serial.EIGHTBITS,
   timeout=0.1
)

def serialrequest(cmd):
	print "SERIAL REQUEST:",repr(cmd)
	ser.write(cmd)
	try:
		read_value = ser.read(1)
		print "Read:", str(read_value)
		read_value = ord(read_value)
		return read_value
	except:
		print "Error"
		return -1

# serial functions
def turn_on(addr):
	cmd =[int(addr),1]
	return serialrequest(cmd)
	

def turn_off(addr):
	cmd =[int(addr),0]
	return serialrequest(cmd)

def get_state(addr):
	cmd =[int(addr)]
	return serialrequest(cmd)

def get_all_states():
	states = []
	for i in range(NUM_CHANELS):
		read_value = get_state(i)
		#states.append(read_value)
		if (read_value == 0):
			states.append(0)
		elif (read_value == 1):
			states.append(1)
		else:
			states.append(-1)
	return states