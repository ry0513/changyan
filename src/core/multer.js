const multer = require("multer");
const RUOYU = require("../config/ruoyu");

const multerOptions = ({ fileSize, mimeType }) => ({
    limits: {
        fileSize: 1024 * 1024 * fileSize,
    },

    fileFilter: (req, file, cb) => {
        if (mimeType.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("File type wrong"), false);
        }
    },
});

module.exports = ({ mimeType = [], fileSize = 10, fields = [] } = {}) => {
    return (req, res, next) => {
        req.files = {};
        const upload = multer(multerOptions({ mimeType, fileSize })).fields(
            fields
        );
        upload(req, res, (err) => {
            if (err) {
                return RUOYU.res.parameter(res);
            } else {
                for (let i = 0; i < fields.length; i++) {
                    const { name, minCount = 0 } = fields[i];
                    if (!req.files[name]) {
                        req.files[name] = [];
                    }
                    if (req.files[name].length < minCount) {
                        return RUOYU.res.parameter(res);
                    }
                }
                next();
            }
        });
    };
};
