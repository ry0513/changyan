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
    // console.log(dynamicData);
    // res.send(dynamicData);

    const format = (w, h) => {
        const max = Math.max(w, h);
        if (max <= 400) {
            return { w, h, w1: w, h1: h };
        }
        if (max > 700 && w >= h) {
            h = (h * 700) / w;
            w = 700;
        } else if (max > 700 && w < h) {
            w = (w * 700) / h;
            h = 700;
        }
        return {
            w: parseInt(w / 2),
            h: parseInt(h / 2),
            w1: parseInt(w),
            h1: parseInt(h),
        };
    };

    const imagesUrl = ({ imageId, width, height }, grid = false) => {
        console.log({ imageId, width, height });
        const { w1, h1 } = format(width, height);
        width = w1;
        height = h1;
        if (grid) {
            height = width = 280;
        }
        return `/images/${imageId}@w${width}h${height}`;
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
