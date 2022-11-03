const { Router, static } = require("express");
const RUOYU = require("../config/ruoyu");
const fs = require("fs-extra");
const sharp = require("sharp");
const etag = require("etag");
const router = Router();
const { Image } = require("../db/api");
const { log } = require("../config/log");

router.use((req, res, next) => {
    const clientEtag = req.get("If-None-Match");
    const serverEtag = etag(req.path + RUOYU.dayjs().format("YYYY-MM-DD"));
    if (clientEtag === serverEtag) {
        return res.status(304).end();
    }
    next();
});

router.get(
    /^\/([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})(@(?:(?:w(\d+))?)(?:(?:h(\d+))?))?$/,
    async (req, res, next) => {
        let {
            0: imageId,
            1: multiple,
            2: width = 0,
            3: height = 0,
        } = req.params;
        const imageData = await Image.getImage({
            where: { imageId },
            attributes: ["userId", "width", "height"],
        });
        if (imageData) {
            width = parseInt(
                Math.min(width, imageData.width) || imageData.width
            );
            height = parseInt(
                Math.min(height, imageData.height) || imageData.height
            );
            const path = `./images/${imageData.userId}/${imageData.name}`;
            if (fs.existsSync(path)) {
                sharp(path, { animated: true })
                    .resize({
                        width,
                        height,
                        fit: "cover",
                    })
                    .composite(
                        width > 200 && height > 50
                            ? [
                                  {
                                      input: {
                                          text: {
                                              text: `<span size="${
                                                  (Math.max(500, width) / 500) *
                                                  14
                                              }pt"  color="#FFFFFF">畅言 @${
                                                  imageData.user.nickName
                                              }    \n </span>`,
                                              align: "right",
                                              fontfile: RUOYU.path(
                                                  __dirname,
                                                  "../../static/font/LXGWWenKaiMonoGB-Regular.ttf"
                                              ),
                                              rgba: true,
                                          },
                                      },
                                      gravity: "southeast",
                                  },
                              ]
                            : []
                    )
                    .webp({
                        quality: multiple ? 40 : 80,
                    })
                    .toBuffer((err, data) => {
                        res.setHeader("Content-Type", "image/webp");
                        res.setHeader(
                            "ETag",
                            etag(req.path + RUOYU.dayjs().format("YYYY-MM-DD"))
                        );
                        res.setHeader(
                            "last-modified",
                            RUOYU.dayjs(fs.statSync(path).mtime).toString()
                        );
                        res.write(data);
                        res.end();
                    });
            } else {
                return RUOYU.res.error(res, {
                    msg: "您访问的图片找不到了 T_T",
                });
            }
        } else {
            next();
        }
    }
);
// router.get("/avatar/:id", (req, res, next) => {
//     // log

//     // const path = `./images/avatar/${req.params.id}.jpg`;
//     // sharp(path, { animated: true })
//     RUOYU.res.error(res);
// });

module.exports = router;
