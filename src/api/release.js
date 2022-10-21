const { Router } = require("express");
const fs = require("fs-extra");
const sharp = require("sharp");
const { body, validationResult } = require("express-validator");
const multer = require("../core/multer");
const RUOYU = require("../config/ruoyu");
const router = Router();
const { Dynamic, Image, User } = require("../db/api");

router.post(
    "/",
    async (req, res, next) => {
        const [userId, userCode] = (req.headers["user-code"] || "").split("-");
        const userInfo = await User.getUserInfo({
            userId,
            userCode,
        });
        if (userInfo) {
            req.userInfo = userInfo;
            next();
        } else {
            RUOYU.res.error(res, { data: "无效的身份码" });
        }
    },
    multer({
        fields: [{ name: "images", maxCount: 9 }],
        mimeType: RUOYU.mimeType.image,
    }),
    body("content")
        .isString()
        .if((value, { req }) => {
            return !req.body.content;
        })
        .custom((value, { req }) => {
            return req.files.images.length !== 0;
        })
        .default("分享图片"),
    async (req, res) => {
        if (!validationResult(req).isEmpty()) {
            return RUOYU.res.parameter(res);
        }
        if (
            !(await RUOYU.isMimeType(req.files["images"], RUOYU.mimeType.image))
        ) {
            return RUOYU.res.error(res, {
                data: "文件实际类型错误",
            });
        }
        const userId = req.userInfo.userId;
        const content = req.body.content;
        const images = req.files["images"];
        const clientInfo = RUOYU.clientInfo(req);
        const dynamic = await Dynamic.createDynamic({
            userId,
            content,
            ...clientInfo,
        });

        for (const item of images) {
            await ((item) => {
                return new Promise(async (resolve, reject) => {
                    let iamgeInfo = {
                        userId,
                        dynamicId: dynamic.dynamicId,
                        url: `/images/original/${
                            RUOYU.uuid() + RUOYU.extname(item.originalname)
                        }`,
                        thumbnailUrl: `/images/thumbnail/${RUOYU.uuid()}.webp`,
                        ...clientInfo,
                    };

                    // 保存原图
                    fs.writeFileSync(
                        RUOYU.path(__dirname, `../../${iamgeInfo.url}`),
                        item.buffer
                    );

                    // 保存缩略图

                    const saveImage = async (
                        buffer,
                        url,
                        thumbnail = false
                    ) => {
                        const image = sharp(buffer, {
                            animated: true,
                        });
                        const { width, height, pageHeight, size, pages } =
                            await image.metadata();

                        if (thumbnail) {
                            const max = Math.min(
                                Math.max(width, pageHeight || height) * 2,
                                800
                            );
                            return image
                                .resize({
                                    width: images.length === 1 ? max : 280,
                                    height: images.length === 1 ? max : 280,
                                    fit:
                                        images.length === 1
                                            ? "inside"
                                            : "cover",
                                })
                                .webp({
                                    quality: 50,
                                })
                                .toFile(`./${url}`)
                                .then(({ height, width, size }) => {
                                    return {
                                        thumbnailHeight:
                                            height / (pages || 1) / 2,
                                        thumbnailWidth: width / 2,
                                        thumbnailSize: size,
                                    };
                                });
                        } else {
                            return {
                                height: pageHeight || height,
                                width,
                                size,
                            };
                        }
                    };
                    iamgeInfo = {
                        ...iamgeInfo,
                        ...(await saveImage(item.buffer, iamgeInfo.url)),
                        ...(await saveImage(
                            item.buffer,
                            iamgeInfo.thumbnailUrl,
                            true
                        )),
                    };
                    resolve(await Image.createImage(iamgeInfo));
                });
            })(item);
        }

        RUOYU.res.success(res);
    }
);

module.exports = router;
