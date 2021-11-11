const logDetector = require('../log-detector');
const myMockedModule = jest.genMockFromModule('../log-detector');

test('should add one line with 1 attempt attack', function () {
    const sourceArray = [['80.238.9.179','1305000','FAILURE','badUsername']];
    let destinationArray = [];
    logDetector.addLine(destinationArray, sourceArray);
    expect(destinationArray[0][2]).toBe(1);
});

test('should add no more then one line with 1 attempt attack', function () {
    const sourceArray = [['90.238.9.179','1305000','FAILURE','badUsername']];
    let destinationArray = [];
    logDetector.addLine(destinationArray, sourceArray);
    expect(destinationArray.length).toBe(1);
});

test('should return the position of existing ip', function () {
    const testArray = [['90.238.9.179', '1905000', 4], ['80.80.9.17', '1905000', 5]];
    let ip = '80.80.9.17';
    expect(logDetector.existingIp(testArray, ip)).toBe(1);
});

test('should return -1 if ip does not exist', function () {
    const testArray = [['90.238.9.179', '1905000', 4], ['80.80.9.17', '1905000', 5]];
    let ip = '100.80.9.17';
    expect(logDetector.existingIp(testArray, ip)).toBe(-1);
});

test('should return the position of the ip attempting to attack with more than 5 tries', function () {
    const sourceArray = [['90.238.9.179', '1905000', 4], ['80.80.9.17', '1905000', 5]];
    let ip = '80.80.9.17';
    expect(logDetector.isAttackAttempt(sourceArray, ip)).toBe(1);
});

test('should return -1 if the ip does not bypass 5 tries to attack', function () {
    const sourceArray = [['90.238.9.179', '1905000', 4], ['80.80.9.17', '1905000', 5]];
    let ip = '90.238.9.179';
    expect(logDetector.isAttackAttempt(sourceArray, ip)).toBe(-1);
});

test('should return false if the ip is attempting to attack less then 5 times or more within 5 minutes', function () {
    myMockedModule.parseLine.mockImplementation(() => '80.238.9.179');
    const logLine = '90.238.9.179,1305000,FAILURE,badUsername';
    expect(logDetector.detectAndReportAttempt(logLine)).toBe(false);
});

test('should return true if the ip is attempting to attack 5 times or more within 5 minutes', function () {
    myMockedModule.parseLine.mockImplementation(() => '80.238.9.179');
    const logLine = '90.238.9.179,1305000,FAILURE,badUsername';
    logDetector.detectAndReportAttempt(logLine);
    logDetector.detectAndReportAttempt(logLine);
    logDetector.detectAndReportAttempt(logLine);
    logDetector.detectAndReportAttempt(logLine);
    expect(logDetector.detectAndReportAttempt(logLine)).toBe(true);
});