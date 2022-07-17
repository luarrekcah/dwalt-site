//For logs, notify and website vital functions

const { getDatabase, ref, onChildChanged } = require("@firebase/database");

//Switchs 

const db = getDatabase(),
switches = ref(db, "switches");
onChildChanged(switches, (snapshot) => {
console.log(`Modo Manutenção Alterado para: ${snapshot.val()} / Horário: ${Date.now()}`)
process.exit(0);
});

//Switchs End