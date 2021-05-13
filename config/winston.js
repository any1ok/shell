const fs = require("fs");
const winston = require("winston");
require('winston-daily-rotate-file');
require('date-utils');

const logDir = __dirname+"/../logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logger_inner = winston.createLogger({
  level: 'info', // 최소 레벨
  // 파일저장
  transports: [
      new winston.transports.DailyRotateFile({
          filename : '../logs/info.log', // log 폴더에 system.log 이름으로 저장
          zippedArchive: true, // 압축여부
          format: winston.format.printf(
              info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${JSON.stringify(info.message)}`)
      }),
      // 콘솔 출력
      new winston.transports.Console({
        format: winston.format.printf(
          info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${JSON.stringify(info.message)}`)
      })
  ]
})

const logger = winston.createLogger({
  level: 'debug', // 최소 레벨
  // 파일저장
  transports: [
      new winston.transports.DailyRotateFile({
          filename : '../logs/error.log', // log 폴더에 system.log 이름으로 저장
          zippedArchive: true, // 압축여부
          format: winston.format.printf(
              info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
      }),
      // 콘솔 출력
      new winston.transports.Console({
          format: winston.format.printf(
              info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
      })
  ]
});

const stream = {
  write: message => {
    logger_inner.info(message)
  }
}

module.exports = { logger, stream };