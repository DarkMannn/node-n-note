import * as Fs from 'fs';
import { DATA_PATH, isObjectsKeyBiggerDateThan } from './utils';

type journal = {
    [key: string]: string[]
};

/**
 * read methods
 */
type _mapSingleJournalType = (journal: journal) => string[];
const _mapSingleJournal: _mapSingleJournalType = (journalsOnSingleDate) => {

    const [[key, journals]] = Object.entries(journalsOnSingleDate);
    return journals.map((journal) => `${key}: \n${journal}`);
};

type readLastNType = (n: number) => string[];
export const readLastN: readLastNType = (n) => {

    const data = require(DATA_PATH);
    const journals: journal[] = data.journal;

    const lastN = journals.slice(-n);
    return lastN.length ? lastN.flatMap(_mapSingleJournal) : ['Not Found'];
};

type readOnDateType = (date: string) => string[];
export const readOnDate: readOnDateType = (date) => {

    const data = require(DATA_PATH);
    const journals: journal[] = data.journal;

    const journalsOnDate = journals.find((journal) => !!journal[date]);
    return journalsOnDate ? _mapSingleJournal(journalsOnDate) : ['Not Found'];
};

type readFromToType = (from: string, to?: string) => string[];
export const readFromTo: readFromToType = (from, to) => {

    const data = require(DATA_PATH);
    const journals: journal[] = data.journal;

    let fromIndex: number;
    if (isNaN((new Date(from)).getTime())) {
        return ['Not Found'];
    }
    else {
        const fromIndexTemp = journals.findIndex((journal) => !!journal[from]);
        fromIndex = fromIndexTemp === -1
            ? journals.findIndex(isObjectsKeyBiggerDateThan(from))
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
        const toIndexTemp = journals.findIndex((journal) => !!journal[to]);
        toIndex = toIndexTemp === -1
            ? journals.findIndex(isObjectsKeyBiggerDateThan(to))
            : toIndexTemp + 1;
    }

    const journalsFromTo = journals.slice(fromIndex, toIndex);
    return journalsFromTo.length ? journalsFromTo.flatMap(_mapSingleJournal) : ['Not Found'];
};

/**
 * write methods
 */
type writeType = (newEntry: string) => void;
export const write: writeType = (newEntry) => {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString('en-GB');
    const lastIndex = data.journal.length - 1;
    if (data.journal.length && Array.isArray(data.journal[lastIndex][currentDate])) {
        data.journal[lastIndex][currentDate].push(newEntry);
    }
    else {
        data.journal.push({ [currentDate]: [newEntry] });
    }

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};
