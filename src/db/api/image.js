const { Dynamic, User, Image } = require("../index.js");

module.exports = {
    /**
     * @description 新增
     */
    createImage: (data) => {
        return Image.create(data);
    },
};
