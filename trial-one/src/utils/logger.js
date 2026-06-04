const fs = require('fs');
const os = require('os');
const path = require('path');

const logPath = path.join(os.tmpdir(), "logger.log");

function getTime(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}`;
}


// function requestLogWithoutBody(request, reply) {
//     const time = getTime();
//     const interfacePath = request.url;
//     const method = request.method;
//     const headers = JSON.stringify(request.headers);
//     const other = '';
//     const format = `[${time}]rec request: <${interfacePath}> - <${method}> - <${headers}> - <${other}>`;
//     writeLog(format);
// }

function requestLogWithBody(request, reply) {
    const time = getTime();
    const interfacePath = request.url;
    const method = request.method;
    const headers = request.headers;
    const body = JSON.stringify(request.body);
    const other = '';
    const format = `[${time}]rec request: <${interfacePath}> - <${method}> - <${headers}> - <${body}> - <${other}>`;
    writeLog(format);
}

function responseLog(request, reply, payload) {
    const time = getTime();
    const code = reply.statusCode;
    const headers = JSON.stringify(reply.getHeaders());

    const body = payload || '';
    const other = '';
    const format = `[${time}]send response: <${code}> - <${body}> - <${headers}> - <${other}>`;
    writeLog(format)
}


function writeLog(content) {
    fs.appendFile(logPath, content, err => {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {requestLogWithBody, /** requestLogWithoutBody,*/ responseLog};