const fs = require("fs-extra");
const RUOYU = require("../config/ruoyu");
const { sequelize } = require("./connect");

const modules = {};
for (const key of fs.readdirSync(RUOYU.path(__dirname, "modles"))) {
    modules[key.split(".")[0]] = require(RUOYU.path(__dirname, "modles", key));
}

const { User, Dynamic, Image } = modules;

User.hasMany(Dynamic, { foreignKey: "userId" });
Dynamic.belongsTo(User, { foreignKey: "userId" });

Dynamic.hasMany(Image, { foreignKey: "dynamicId" });
Image.belongsTo(Dynamic, { foreignKey: "dynamicId" });

User.hasMany(Image, { foreignKey: "userId" });
Image.belongsTo(User, { foreignKey: "userId" });

(async () => {
    await sequelize.sync({ alter: true });
})();

module.exports = modules;
