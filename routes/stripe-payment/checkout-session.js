const express = require('express')
, router = express.Router();


router.get('/', async function(req, res, next) {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

module.exports = router;