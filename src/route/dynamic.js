const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.send("555");
});

module.exports = router;
