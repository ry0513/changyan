const { Dynamic, User, Image } = require("../index.js");

module.exports = {
    /**
     * @description 新增
     */
    getUserInfo: ({ userId, userCode }) => {
        return User.findOne({
            where: { userId, userCode },
        });
    },
};
