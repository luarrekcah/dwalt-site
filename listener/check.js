const { getDatabase, ref, onValue } = require("@firebase/database");

const checkMaintenence = () => {
  const db = getDatabase();
  const switches = ref(db, "switches");
  onValue(switches, (snapshot) => {
    if (snapshot.val().modoManutencao === true) {
      return true;
    } else {
      return false;
    }
  });
};

//Transfer to Auto Check
const checkEnv = () => {
  const price = process.env.PRICE;
  if (price === "price_12345" || !price) {
    console.log(
      "You must set a Price ID in the environment variables. Please see the README."
    );
    process.exit(0);
  }
};

module.exports = { checkMaintenence, checkEnv };
