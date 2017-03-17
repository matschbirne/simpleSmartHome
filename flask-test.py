from flask import Flask, render_template, jsonify, request
import time
import serialdriver_dummy as ser

app = Flask(__name__)

# web functions
@app.route("/")
def index():
	return render_template('index.html')

@app.route("/<type>/<id>/<action>")
def execute_action(type,id,action):
	if type == "socket":
		if action == "on":
			return str(ser.socket_on(id))
		elif action == "off":
			return str(ser.socket_off(id))
		else:
			return "unknown action"
	else: 
		return "unknown type"

@app.route("/state")
def states():
	state = {} # system state
	
	# sum up socket information
	socket_states = []
	id = 0
	for s in ser.get_all_socket_states():
		curr_state = {}
		curr_state["id"] = str(id)
		curr_state["state"] = str(s)
		socket_states.append(curr_state)
		id += 1

	state["sockets"] = socket_states
	return jsonify(state)#render_template('states.html',s0=states[0],s1=states[1],s2=states[2],s3=states[3])


if __name__ == "__main__":
	app.run(debug=True, host='0.0.0.0',port=80)