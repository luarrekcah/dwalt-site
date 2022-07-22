const express = require("express"),
  router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

router.post("/", async function (req, res, next) {
  const domainURL = process.env.DOMAIN,
        price = req.body.price

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `https://www.dlwalt.com/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://www.dlwalt.com/cancelado`,
    // automatic_tax: {enabled: true},
  });

  return res.redirect(303, session.url);
});

module.exports = router;
