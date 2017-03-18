from flask import Flask, render_template, jsonify, request
import time
import serialdriver_dummy as ser
import sys
import json

app = Flask(__name__)
configfilename = sys.argv[1]
configfile = open(configfilename,'r')
config = json.loads(configfile.read())
print config

# web functions
@app.route("/")
def index():
	return render_template('index.html')

@app.route("/<type>/<id>/<action>")
def set_state(type,id,action):
	result = {}
	result["is_success"] = "true"
	result["id"] = str(id)
	if type == "socket":
		if action == "on":
			result["state"] = str(ser.socket_on(id))
		elif action == "off":
			result["state"] = str(ser.socket_off(id))
		elif action == "toggle":
			result["state"] = str(ser.socket_toggle(id))
		elif action == "get":
			result["state"] = str(ser.socket_get_state(id))
		else: # unknown action
			result["is_success"] = "false"
	else: # unknown type
		result["is_success"] = "false"
	return jsonify(result)


@app.route("/states")
def states():
	state = {} # system state
	
	# sum up socket information
	socket_states = []
	id = 0
	for s in config["sockets"]:
		curr_state = {}
		curr_state["id"] = str(s["id"])
		curr_state["state"] = str(ser.socket_get_state(s["id"]))
		socket_states.append(curr_state)
		id += 1

	state["sockets"] = socket_states
	return jsonify(state)


if __name__ == "__main__":
	app.run(debug=True, host='0.0.0.0',port=80)