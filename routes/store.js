const express = require("express"),
    router = express.Router(),
    { getDatabase, ref, onValue } = require("@firebase/database");
let logMessage = {
    content: null,
    type: null,
    icon: null
};
const objetoVazio = (obj) => {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
}
router.get("/", (req, res) => {
    const db = getDatabase();
    const dataWebSite = ref(db, "dataWebSite");
    onValue(dataWebSite, (snapshot) => {
        let products = [];
        if (!objetoVazio(req.query)) {
            products = snapshot.val().products.filter((item, i) => {
                const query = req.query;
                let searchType;
                console.log(query); //log enquanto está em desenvolvimento
                if (query.prod) {
                    searchType = 'prod';
                } else if (query.kwp) {
                    searchType = 'kwp';
                } else {
                    searchType = 'none';
                }
                const kwp = ((item.datasheet.modules.power / 1000).toFixed(2)
                    * item.datasheet.modules.quantity),
                    prodkW = kwp * 30 * 4.5;
                switch (searchType) {
                    case 'prod':
                        if (prodkW >= query.prod
                            && item.datasheet.type === req.typeInver
                            && item.datasheet.inverter.brand === req.inversor
                            && item.datasheet.modules.brand === req.placa
                        ) {
                            return item;
                        }
                        break;
                    case 'kwp':
                        //caso n houver kw
                        break;
                    case 'none':
                        //caso n houver nada
                        break;
                    default:
                        break;
                }
            });
            if (products.length !== 0) {
                logMessage = {
                    content: `${products.length} produtos encontrados de ${snapshot.val().products.length}.`,
                    type: 'success',
                    icon: null
                }
            } else {
                logMessage = {
                    content: "Verifique os filtros aplicados",
                    type: 'error',
                    icon: null
                }
            }
        } else {
            products = snapshot.val().products;
        }
        const data = {
            dbData: snapshot.val(),
            products,
            og: {
                title: "Produtos",
                desc: "Listagem de alguns kits com meio de pagamento e solicitação. Entre em contato para orçamento de um kit personalizado.",
                banner: "/images/ogimages/products.jpg",
            },
            logMessage,
        };
        res.render("pages/store/allProducts", data);
    });
});

router.get("/:id", (req, res) => {
    const db = getDatabase();
    const dataWebSite = ref(db, "dataWebSite");
    onValue(dataWebSite, (snapshot) => {
        const products = snapshot.val().products;
        const product = products.find((item) => item.code === req.params.id)
        const data = {
            dbData: snapshot.val(),
            og: {
                title: `${product === undefined ? 'Gerador' : product.resumedtitle} - Produtos`,
                desc: `Informações do ${product === undefined ? 'Gerador' : product.resumedtitle}`,
                banner: product === undefined ? 'None' : product.media,
            },
            product,
            logMessage
        };
        res.render("pages/store/productDetails", data);
    });
});

module.exports = router;
