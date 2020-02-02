import * as Fs from 'fs';
import * as Path from 'path';

const DATA_PATH = Path.join(__dirname, '../../data/data.json');

export function writeJournal(newEntry: string): void {

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

interface dailyRetro {
    doRepeat: string;
    doNotRepeat: string;
    lessonLearned: string;
    gratefulFor: string;
}
export function writeDailyRetro(newDailyRetro: dailyRetro): void {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString();
    data.dailyRetro[currentDate] = newDailyRetro;

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};

export function readDailyRetro(): dailyRetro {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString();
    const currentDailyRetro = data.dailyRetro[currentDate];

    return currentDailyRetro || {
        doRepeat: '',
        doNotRepeat: '',
        lessonLearned: '',
        gratefulFor: ''
    };
};

export function writeClassicNote() {};
