NUM_CHANELS = 4

socket_states = [0,0,0,0]

# serial functions
def socket_on(addr):
	socket_states[int(addr)] = 1
	print "Dummy Turn on:",str(addr)
	return 1
	
def socket_off(addr):
	socket_states[int(addr)] = 0
	print "Dummy Turn off:",str(addr)
	return 0

def socket_toggle(addr):
	if (socket_states[int(addr)] == 0):
		return socket_on(addr)
	else:
		return socket_off(addr)

def socket_get_state(addr):
	return socket_states[int(addr)]
