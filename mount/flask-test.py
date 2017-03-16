from flask import Flask, render_template, jsonify, request
import time
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


app = Flask(__name__)

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

def read_addr(addr):
	cmd =[int(addr)]
	return serialrequest(cmd)


def read_states():
	states = []
	for i in range(NUM_CHANELS):
		read_value = read_addr(i)
		#states.append(read_value)
		if (read_value == 0):
			states.append("AUS")
		elif (read_value == 1):
			states.append("AN")
		else:
			states.append("???")
	return states

# web functions
@app.route("/")
def index():
	return render_template('index.html')

@app.route("/on/<address>")
def on(address):
	return str(turn_on(address))


@app.route("/off/<address>")
def off(address):
	return str(turn_off(address))

@app.route("/state")
def states():
	states = read_states()
	return jsonify(states)#render_template('states.html',s0=states[0],s1=states[1],s2=states[2],s3=states[3])


if __name__ == "__main__":
	app.run(debug=True, host='0.0.0.0',port=80)