const log4js = require("log4js");
const fs = require("fs-extra");
const { resolve } = require("path");
const dayjs = require("dayjs");

const LogFilePath = resolve(__dirname, "../../logs");
if (!fs.existsSync(LogFilePath)) fs.mkdirSync(LogFilePath);

log4js.configure({
    appenders: {
        out: {
            type: "stdout",
            layout: {
                type: "pattern",
                pattern: "[%d{yyyy/MM/dd hh:mm:ss}] [%[%p%]] %m",
            },
        },
        app: {
            type: "file",
            filename: resolve(
                LogFilePath,
                dayjs().format("YYYY-MM-DD-HH-mm-ss.log")
            ),
            layout: {
                type: "pattern",
                pattern: "[%d{yyyy/MM/dd hh:mm:ss}] [%p] %m",
            },
        },
    },
    categories: {
        default: {
            appenders: ["out", "app"],
            level: "trace",
        },
    },
});

const logger = log4js.getLogger("default");

logger.info(`
___/\\\\\\\\\\\\\\\\\\__________________________________/\\\\\\________/\\\\\\_______________
__/\\\\\\///////\\\\\\_______________________________\\///\\\\\\____/\\\\\\/________________
 _\\/\\\\\\_____\\/\\\\\\_________________________________\\///\\\\\\/\\\\\\/__________________
  _\\/\\\\\\\\\\\\\\\\\\\\\\/_____/\\\\\\____/\\\\\\_____/\\\\\\\\\\________\\///\\\\\\/_______/\\\\\\____/\\\\\\_
   _\\/\\\\\\//////\\\\\\____\\/\\\\\\___\\/\\\\\\___/\\\\\\///\\\\\\________\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
    _\\/\\\\\\____\\//\\\\\\___\\/\\\\\\___\\/\\\\\\__/\\\\\\__\\//\\\\\\_______\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
     _\\/\\\\\\_____\\//\\\\\\__\\/\\\\\\___\\/\\\\\\_\\//\\\\\\__/\\\\\\________\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
      _\\/\\\\\\______\\//\\\\\\_\\//\\\\\\\\\\\\\\\\\\___\\///\\\\\\\\\\/_________\\/\\\\\\_______\\//\\\\\\\\\\\\\\\\\\__
       _\\///________\\///___\\/////////______\\/////___________\\///_________\\/////////___
`);
module.exports = logger;
