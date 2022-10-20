const { Router } = require("express");
const fs = require("fs-extra");

const router = Router();

const routeList = fs.readdirSync(__dirname).filter((item) => {
    return item !== "index.js";
});
for (const key of routeList) {
    router.use(`/${key.split(".")[0]}`, require(`./${key}`));
}
module.exports = router;
