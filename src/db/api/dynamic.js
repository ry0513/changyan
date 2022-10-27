const { Dynamic, User, Image } = require("../index.js");

module.exports = {
    /**
     * @description 列表
     */
    getDynamicList: ({ where = {}, offset = 0, limit = 10 }) => {
        return Dynamic.findAll({
            attributes: ["dynamicId", "createdAt", "content"],
            order: [
                ["dynamicId", "DESC"],
                [Image, "imageId", "ASC"],
            ],
            where,
            offset,
            limit,
            include: [
                {
                    model: Image,
                    attributes: ["imageId", "width", "height"],
                },
                {
                    model: User,
                    attributes: ["nickName", "avatar"],
                },
            ],
        });
    },

    /**
     * @description 新增
     */
    createDynamic: (data) => {
        return Dynamic.create(data);
    },
};
