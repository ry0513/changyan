const { Router, static } = require("express");
const RUOYU = require("../config/ruoyu");
const fs = require("fs-extra");
const sharp = require("sharp");
const etag = require("etag");
const router = Router();
const { Image } = require("../db/api");

router.get(
    /^\/([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})(@(?:(?:w(\d+))?)(?:(?:h(\d+))?))?$/,
    async (req, res, next) => {
        const clientEtag = req.get("If-None-Match");
        const serverEtag = etag(req.path);
        if (clientEtag === serverEtag) {
            return res.status(304).end();
        }

        const { 0: imageId, 1: multiple, 2: width, 3: height } = req.params;
        if ((width && width < 200) || (height && height < 200)) {
            return RUOYU.res.error(res, {
                data: "width或height小于200",
            });
        }
        const imageData = await Image.getImage({
            where: { imageId },
            attributes: ["userId", "width", "height"],
        });
        if (imageData) {
            const path = `./images/${imageData.userId}/${imageData.name}`;
            console.log(path);
            if (fs.existsSync(path)) {
                sharp(path, { animated: true })
                    .resize({
                        width: parseInt(width || imageData.width),
                        height: parseInt(height || imageData.height),
                        fit: "cover",
                    })
                    .composite([
                        {
                            input: {
                                text: {
                                    text: `<span size="20pt" color="#FFFFFF">畅言 @${imageData.user.nickName}</span>\n`,
                                    // align: "right",
                                    // font: "杨任东竹石体-Bold",
                                    fontfile: RUOYU.path(
                                        __dirname,
                                        "../core/yangrendongzhushiti-Bold.ttf"
                                    ),
                                    rgba: true,
                                },
                            },
                            gravity: "southeast",
                        },
                    ])
                    .webp({
                        quality: multiple ? 50 : 80,
                    })
                    .toBuffer((err, data) => {
                        res.setHeader("Content-Type", "image/webp");
                        res.setHeader("ETag", serverEtag);
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

        // res.send(imageData);
    }
);

router.get("/original/:path", (req, res, next) => {
    const path = `./images/original/${req.params.path}`;
    const clientEtag = req.get("If-None-Match");
    const serverEtag = etag(path);
    // if (clientEtag === serverEtag) {
    //     return res.status(304).end();
    // }
    if (fs.existsSync(path)) {
        sharp(path, { animated: true })
            .composite([
                {
                    input: {
                        text: {
                            text: `<span size="16pt" color="#FFFFFFAA">@天天酷跑达人</span>        \n\n`,
                            align: "right",
                            font: "杨任东竹石体-Bold",
                            fontfile: RUOYU.path(
                                __dirname,
                                "../core/yangrendongzhushiti-Bold.ttf"
                            ),
                            rgba: true,
                        },
                    },
                    // gravity: "south",
                },
                // {
                //     input: {
                //         text: {
                //             text: `<span size="16pt" color="#FFFFFFAA" style="italic">www.changyan.cc</span>        \n`,
                //             align: "right",
                //             font: "杨任东竹石体-Bold",
                //             fontfile: RUOYU.path(
                //                 __dirname,
                //                 "../core/yangrendongzhushiti-Bold.ttf"
                //             ),
                //             rgba: true,
                //         },
                //     },
                //     gravity: "south",
                // },
            ])
            .webp()
            .toBuffer((err, data) => {
                res.setHeader("Content-Type", "image/webp");
                res.setHeader("ETag", serverEtag);
                res.write(data);
                res.end();
            });
    } else {
        next();
    }
});
router.use(
    "/thumbnail/",
    static(RUOYU.path(__dirname, "../../images/thumbnail"))
);

module.exports = router;
