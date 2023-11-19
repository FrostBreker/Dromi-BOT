const originalEmit = process.emit;
process.emit = function (event, error) {
    if (
        event === 'warning' &&
        error.name === 'ExperimentalWarning'
    ) {
        return false;
    }

    return originalEmit.apply(process, arguments);
};