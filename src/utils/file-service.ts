import * as Fs from 'fs';
import * as Path from 'path';

const DATA_PATH = Path.join(__dirname, '../../data/data.json');

type writeJournalType = (newEntry: string) => void;
export const writeJournal: writeJournalType = (newEntry) => {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString();
    const lastIndex = data.journal.length - 1;
    if (data.journal.length && Array.isArray(data.journal[lastIndex][currentDate])) {
        data.journal[lastIndex][currentDate].push(newEntry);
    }
    else {
        data.journal.push({ [currentDate]: [newEntry] });
    }

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};

interface dailyRetro {
    doRepeat: string;
    doNotRepeat: string;
    lessonLearned: string;
    gratefulFor: string;
}
type writeDailyRetroType = (newDailyRetro: dailyRetro) => void;
export const writeDailyRetro: writeDailyRetroType = (newDailyRetro) => {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString();
    const lastIndex = data.dailyRetro.length - 1;
    if (data.dailyRetro.length && data.dailyRetro[lastIndex][currentDate]) {
        data.dailyRetro[lastIndex][currentDate] = newDailyRetro;
    }
    else {
        data.dailyRetro.push({ [currentDate]: newDailyRetro });
    }

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};

type readDailyRetroType = () => dailyRetro;
export const readDailyRetro: readDailyRetroType = () => {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString();
    const lastIndex = data.dailyRetro.length - 1;
    const currentDailyRetro = data.dailyRetro.length && data.dailyRetro[lastIndex][currentDate];

    return currentDailyRetro || {
        doRepeat: '',
        doNotRepeat: '',
        lessonLearned: '',
        gratefulFor: ''
    };
};

interface classicNote {
    tag: string;
    note: string;
}
type writeClassicNoteType = (newClassicNote: classicNote) => void;
export const writeClassicNote: writeClassicNoteType = (newClassicNote) => {

    const data = require(DATA_PATH);

    if (Array.isArray(data.classicNote[newClassicNote.tag])) {
        data.classicNote[newClassicNote.tag].push(newClassicNote.note);
    }
    else {
        data.classicNote[newClassicNote.tag] = [newClassicNote.note];
    }

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};

type readClassinNoteTagsType = () => string[];
export const readClassinNoteTags: readClassinNoteTagsType = () => {

    const data = require(DATA_PATH);
    const tags = Object.keys(data.classicNote);
    return tags;
};
