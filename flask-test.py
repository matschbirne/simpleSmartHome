from flask import Flask, render_template, jsonify, request
import time
import serialdriver_dummy as ser
import sys
import json

app = Flask(__name__)
configfilename = sys.argv[1]
configfile = open(configfilename,'r')
config = json.loads(configfile.read())
print "Configuration:",config

# web functions
@app.route("/")
def index():
	return render_template('index.html')

@app.route("/<type>/<id>/<action>")
def action(type,id,action):
	result = {}
	result["is_success"] = "true"
	result["id"] = str(id)
	if type == "socket":
		if action == "on":
			result["state"] = ser.socket_on(config[str(id)]["addr"])
		elif action == "off":
			result["state"] = ser.socket_off(config[str(id)]["addr"])
		elif action == "toggle":
			result["state"] = ser.socket_toggle(config[str(id)]["addr"])
		elif action == "get":
			result["state"] = ser.socket_get_state(config[str(id)]["addr"])
		else: # unknown action
			result["is_success"] = "false"
	else: # unknown type
		result["is_success"] = "false"
	return jsonify(result)


@app.route("/states")
def states():
	states = {} # system state
	
	for id in config:
		states[str(id)] = ser.socket_get_state(config[id]["addr"])
		
	return jsonify(states)

@app.route("/info")
def info():
	for id in config:
		config[id]["state"] = ser.socket_get_state(config[id]["addr"])
		
	return jsonify(config)

if __name__ == "__main__":
	app.run(debug=True, host='0.0.0.0',port=80)
