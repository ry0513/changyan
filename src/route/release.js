const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.locals = {
        page: "release",
        cssList: ["release"],
        jsList: ["release"],
    };
    res.render("layout/web");
});

module.exports = router;
