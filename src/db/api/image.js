const { Dynamic, User, Image } = require("../index.js");

module.exports = {
    /**
     * @description 新增
     */
    createImage: (data) => {
        return Image.create(data);
    },
    /**
     * @description 查询
     */
    getImage: ({ where = {}, attributes = [] }) => {
        return Image.findOne({
            attributes: ["imageId", "name", ...attributes],
            where,
            include: [
                {
                    model: User,
                    attributes: ["nickName"],
                },
            ],
        });
    },
};
