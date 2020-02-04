import * as Fs from 'fs';
import * as Path from 'path';

const DATA_PATH = Path.join(__dirname, '../../data/data.json');

type writeJournalType = (newEntry: string) => void;
export const writeJournal: writeJournalType = (newEntry) => {

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
type writeDailyRetroType = (newDailyRetro: dailyRetro) => void;
export const writeDailyRetro: writeDailyRetroType = (newDailyRetro) => {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString();
    data.dailyRetro[currentDate] = newDailyRetro;

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};

type readDailyRetroType = () => dailyRetro;
export const readDailyRetro: readDailyRetroType = () => {

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
