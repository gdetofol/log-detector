1. Clone this repository to your computer
2. Go to project folder and donwload dependency modules by running on command prompt: nodejs install
3. run: node log-detector.js
4. Each time the file attempts.log receives a new line entry, parseLine function will be called. (write a new line and save the file)
5. Every time an IP is detected 5 or more time within 5 minutes, the IP address is written to file attemptsReport.txt


Observatios:
Interface was not used since it does not exist on JavaScript.
For simplification, all attempts are deleted when an over 5 minutes entry is received for the same IP.
