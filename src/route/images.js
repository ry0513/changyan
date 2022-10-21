const { Router, static } = require("express");
const RUOYU = require("../config/ruoyu");
const fs = require("fs-extra");
const sharp = require("sharp");
const etag = require("etag");
const router = Router();

router.get("/original/:path", (req, res) => {
    const path = `./images/original/${req.params.path}`;
    const clientEtag = req.get("If-None-Match");
    const serverEtag = etag(path);
    if (clientEtag === serverEtag) {
        return res.status(304).end();
    }
    if (fs.existsSync(path)) {
        sharp(path, { animated: true })
            .webp()
            .toBuffer((err, data) => {
                res.setHeader("Content-Type", "image/webp");
                res.setHeader("ETag", serverEtag);
                res.write(data);
                res.end();
            });
    } else {
        RUOYU.res.error(res, { data: "图片不存在" });
    }
});
router.use(
    "/thumbnail/",
    static(RUOYU.path(__dirname, "../../images/thumbnail"))
);

module.exports = router;
