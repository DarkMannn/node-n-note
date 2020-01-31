var Fs = require('fs');
var Path = require('path');

const DATA_PATH = Path.join(__dirname, '../../data/data.json');

exports.writeJournal = (newEntry: string): void => {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString();
    if (Array.isArray(data.journal[currentDate])) {
        data.journal[currentDate].push(newEntry);
    }
    else {
        data.journal[currentDate] = [newEntry];
    }

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};

exports.writeDailyRetro = () => {};

exports.writeClassicNote = () => {};
