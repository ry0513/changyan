// import { CustomValidator } from "express-validator";
module.exports = {
    isNoNull: (check, key, scope) => {
        return false;
        return (value, { req }) => {
            console.log(check, key);
            console.log(req[check]);
            return false;
            // if (typeof scope === "object") {
            //     return scope.includes(req[check][key]);
            // } else {
            //     return [scope].includes(req[check][key]);
            // }
        };
    },
};
