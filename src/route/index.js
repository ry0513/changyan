const { Router } = require("express");
const fs = require("fs-extra");
const { getDynamicList } = require("../db/api/dynamic");

const router = Router();

const routeList = fs.readdirSync(__dirname).filter((item) => {
    return item !== "index.js";
});
for (const key of routeList) {
    router.use(`/${key.split(".")[0]}`, require(`./${key}`));
}

router.get("/", async (req, res) => {
    const dynamicData = await getDynamicList({ limit: 99 });
    res.locals = {
        dynamicData,
        page: "index",
        cssList: ["card"],
        jsList: ["loadImg"],
    };
    res.render("layout/web");
});

module.exports = router;
