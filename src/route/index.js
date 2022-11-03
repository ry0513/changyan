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
    const format = (w, h) => {
        const max = Math.max(w, h);
        if (max > 350 && w >= h) {
            h = (h * 350) / w;
            w = 350;
        } else if (max > 350 && w < h) {
            w = (w * 350) / h;
            h = 350;
        }
        return {
            w: parseInt(w),
            h: parseInt(h),
        };
    };

    const imagesUrl = ({ imageId, width, height }, grid = false) => {
        const { w, h } = format(width, height);
        if (grid) {
            height = width = 280;
        }
        return `/images/${imageId}@w${w * 2}h${h * 2}`;
    };

    res.locals = {
        dynamicData,
        page: "index",
        cssList: ["card"],
        jsList: ["loadImg"],
        imagesUrl,
        format,
    };
    res.render("layout/web");
});

module.exports = router;
