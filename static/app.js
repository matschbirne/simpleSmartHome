var sockets = new Vue({
	el: '#sockets',
	data : {
		sockets : {},
		loadingStat : ["Nicht geladen"],
		stateChanges : ["toggle", "on", "off"]
	},
	
	beforeMount : function() {
		this.loadingStat.push("Lade Daten")
		axios.get("/info")
		.then(response => {
			this.loadingStat.push("Daten erhalten")
			this.sockets = response.data
		})
	},
	
	methods : {
		set: function(socket, action){
			this.loadingStat.push("Steckdose: "+socket.name+", Zustand: "+socket.state+". Angefragte Aktion: "+action)
			axios.get("/socket/socket"+socket.addr+"/"+action)
			.then(response => {
					if (response.data.is_success) {
						this.loadingStat.push("Steckdose erfolgreich geschaltet: "+socket.name+" --> "+response.data.state)
						socket.state = response.data.state
					}
			})
		}
	},
	
	delimiters : ['[[',']]']
})