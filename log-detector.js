const fs = require('fs');
const readLastLines = require('read-last-lines');
require('log-timestamp');

const attemptsLogFile = './attempts.log';
const attemptsReport = './attemptsReport.txt'

var lastIp;
var lastTime;
var lineArray = [];
var suspiciousArray = [];

console.log(`Watching for file changes on ${attemptsLogFile}`);
fs.watchFile(attemptsLogFile, (curr, prev) => {
  console.log(`${attemptsLogFile} file Changed`);

  readLastLines.read(attemptsLogFile, 1)
    .then((line) => x = detectAndReportAttempt(line));

});

function detectAndReportAttempt(line) {
  let ip = parseLine(line);
  if (!!ip) {
    fs.appendFile(attemptsReport, ip + '\r\n', function (err) {
      if (err) return console.log(err);
    });
  }
}

function parseLine(line) {
  lineArray = String(line).split(',');

  if (lineArray[2] == 'FAILURE') {
    console.log(lineArray[2]);
    addToSuspiciusArray(lineArray);
    let suspiciousPosition = isAttackAttempt(suspiciousArray, lineArray[0]);
    if (suspiciousPosition != -1) {

      return suspiciousArray[suspiciousPosition][0];
    }
    return null;
  }
}

function addToSuspiciusArray(lineArray) {
  let i;

  if (suspiciousArray.length == 0) {
    addLine(suspiciousArray, lineArray);
  } else {
    i = existingIp(suspiciousArray, lineArray[0]);
    console.log(i);
    if (i != -1) {

      if ((parseInt(lineArray[1]) - parseInt(suspiciousArray[i][1]) > 300000)) {
        suspiciousArray.splice(i, 1);
        suspiciousArray.push([lineArray[0], lineArray[1], 1]);
      }
      else {
        console.log('old code:' + suspiciousArray[i]);
        suspiciousArray[i][2] = parseInt(suspiciousArray[i][2]) + 1;
        console.log('new code:' + suspiciousArray[i]);
      }
    }
    else {
      console.log('else' + lineArray[0]);
      addLine(suspiciousArray, lineArray);
    }
  }

  console.log('suspiciousArray:');
  console.log(suspiciousArray);

}

function existingIp(array, value) {
  console.log(array[0][0] + 'HHHH ' + value + ' ' + array.length);
  for (var i = 0, len = array.length; i < len; i++) {

    if (array[i][0] == value) {
      return i;
    }
  }
  return -1;
}

function addLine(arrayTo, arrayFrom) {
  arrayTo.push([arrayFrom[0], arrayFrom[1], 1]);
}

function isAttackAttempt(array, value) {
  let resultArray = [];
  for (var i = 0, len = array.length; i < len; i++) {

    if (array[i][2] > 4 && array[i][0] == value) {
      return i;
    }
  }
  return -1;
}

exports.detectAndReportAttempt = detectAndReportAttempt
exports.parseLine = parseLine
exports.addToSuspiciusArray = addToSuspiciusArray
exports.existingIp = existingIp
exports.addLine = addLine
exports.isAttackAttempt = isAttackAttempt