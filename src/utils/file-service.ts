import * as Fs from 'fs';
import * as Path from 'path';

const DATA_PATH = Path.join(__dirname, '../../data/data.json');

/**
 * Journal
 */
type journal = {
    [key: string]: string[]
};

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

type _mapSingleJournalType = (journal: journal) => string[];
const _mapSingleJournal: _mapSingleJournalType = (journalsOnSingleDate) => {

    const [[key, journals]] = Object.entries(journalsOnSingleDate);
    return journals.map((journal) => `${key}: \n${journal}`);
};

type readJournalLastNType = (n: number) => string[];
export const readJournalLastN: readJournalLastNType = (n) => {

    const data = require(DATA_PATH);
    const journals: journal[] = data.journal;

    const lastN = journals.slice(-n);
    return lastN.length ? lastN.flatMap(_mapSingleJournal) : ['Not Found'];
};

type readJournalOnDateType = (date: string) => string[];
export const readJournalOnDate: readJournalOnDateType = (date) => {

    const data = require(DATA_PATH);
    const journals: journal[] = data.journal;

    const journalsOnDate = journals.find((journal: journal) => !!journal[date]);
    return journalsOnDate ? _mapSingleJournal(journalsOnDate) : ['Not Found'];
};

type readJournalFromToType = (from: string, to?: string) => string[];
export const readJournalFromTo: readJournalFromToType = (from, to) => {

    const data = require(DATA_PATH);
    const journals: journal[] = data.journal;

    let fromIndex: number;
    if (isNaN((new Date(from)).getTime())) {
        return ['Not Found'];
    }
    else {
        const fromIndexTemp = journals.findIndex((journal: journal) => !!journal[from]);
        fromIndex = fromIndexTemp === -1
            ? journals.findIndex((journal: journal) => (new Date(Object.keys(journal)[0]).getTime()) > (new Date(from)).getTime())
            : fromIndexTemp;
    }

    let toIndex: number;
    if (!to || isNaN((new Date(to)).getTime())) {
        toIndex = journals.length;
    }
    else if (from === to ) {
        toIndex = fromIndex + 1;
    }
    else {
        const toIndexTemp = journals.findIndex((journal: journal) => !!journal[to]);
        toIndex = toIndexTemp === -1
            ? journals.findIndex((journal: journal) => (new Date(Object.keys(journal)[0]).getTime()) > (new Date(to)).getTime())
            : toIndexTemp + 1;
    }

    const journalsFromTo = journals.slice(fromIndex, toIndex);
    return journalsFromTo.length ? journalsFromTo.flatMap(_mapSingleJournal) : ['Not Found'];
};

/**
 * Daily Retro
 */
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

/**
 * Classic Note
 */
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
