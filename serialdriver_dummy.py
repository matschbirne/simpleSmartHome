NUM_CHANELS = 4

socket_states = [0,0,0,0]

# serial functions
def socket_on(id):
	socket_states[int(id)] = 1
	print "Dummy Turn on:",str(id)
	return 1
	
def socket_off(id):
	socket_states[int(id)] = 0
	print "Dummy Turn off:",str(id)
	return 0

def get_socket_state(id):
	return socket_states[int(id)]

def get_all_socket_states():
	return socket_states