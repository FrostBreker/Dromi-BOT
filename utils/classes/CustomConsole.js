const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class CustomConsole extends EventEmitter {
    constructor() {
        super();
        const originalConsoleLog = console.log;

        const logFileName = `../../logs/log-${Date.now()}.log`; // Create a unique log file name based on the start time

        // Create the log file when the CustomConsole is instantiated
        fs.writeFileSync(path.join(__dirname, logFileName), '');

        console.log = (...args) => {
            // Emit an event for every console log
            this.emit('consoleLog', args);

            // Write logs to the log file
            fs.appendFile(path.join(__dirname, logFileName), args.join(' ') + '\n', (err) => {
                if (err) throw err;
            });

            // Call the original console.log function to keep the original behavior
            originalConsoleLog.apply(console, args);
        };
    }
}

module.exports = CustomConsole;