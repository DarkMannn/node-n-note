import * as Fs from 'fs';
import { DATA_PATH, isObjectsKeyBiggerDateThan } from './utils';

type dailyRetro = {
    doRepeat: string;
    doNotRepeat: string;
    lessonLearned: string;
    gratefulFor: string;
}
export type dailyRetroNested = {
    [index: string]: dailyRetro
};
enum dailyRetroTypes {
    doRepeat = 'doRepeat',
    doNotRepeat = 'doNotRepeat',
    lessonLearned = 'lessonLearned',
    gratefulFor = 'gratefulFor'
}
export type dailyRetroKeys = keyof typeof dailyRetroTypes;

const EMPTY_TEMPLATE: dailyRetro = {
    doRepeat: '',
    doNotRepeat: '',
    lessonLearned: '',
    gratefulFor: ''
};
const EMPTY_TEMPLATE_NESTED: dailyRetroNested = {
    'dd/mm/yyyy': EMPTY_TEMPLATE
};

/**
 * read methods
 */
type readTodayEntryType = () => dailyRetro;
export const readTodayEntry: readTodayEntryType = () => {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString('en-GB');
    const lastIndex = data.dailyRetro.length - 1;
    const currentDailyRetro = data.dailyRetro.length && data.dailyRetro[lastIndex][currentDate];

    return currentDailyRetro || EMPTY_TEMPLATE;
};

type readLastNType = (n: number) => dailyRetroNested[];
export const readLastN: readLastNType = (n) => {

    const data = require(DATA_PATH);
    const dailyRetros: dailyRetroNested[] = data.dailyRetro;

    const lastN = dailyRetros.slice(-n);
    return lastN.length ? lastN : [EMPTY_TEMPLATE_NESTED];
};

const _isDailyRetroType = (type: string): type is dailyRetroKeys => {

    const dailyRetroKeys = Object.keys(dailyRetroTypes);
    return dailyRetroKeys.includes(type);
};

type readByTypeType = (type: string) => string[];
export const readByType: readByTypeType = (type) => {

    if (!_isDailyRetroType(type)) {
        return ['Not Found'];
    }

    const data = require(DATA_PATH);
    const dailyRetros: dailyRetroNested[] = data.dailyRetro;
    return dailyRetros.map((dailyRetro) => Object.values(dailyRetro)[0][type]).filter(Boolean);
};

type readOnDateType = (date: string) => dailyRetroNested[];
export const readOnDate: readOnDateType = (date) => {

    const data = require(DATA_PATH);
    const dailyRetros: dailyRetroNested[] = data.dailyRetro;

    const dailyRetroOnDate = dailyRetros.find((dailyRetro) => !!dailyRetro[date]);
    return dailyRetroOnDate ? [dailyRetroOnDate] : [EMPTY_TEMPLATE_NESTED];
};

type readFromToType = (from: string, to?: string) => dailyRetroNested[];
export const readFromTo: readFromToType = (from, to) => {

    const data = require(DATA_PATH);
    const dailyRetros: dailyRetroNested[] = data.dailyRetro;

    let fromIndex: number;
    if (isNaN((new Date(from)).getTime())) {
        return [EMPTY_TEMPLATE_NESTED];
    }
    else {
        const fromIndexTemp = dailyRetros.findIndex((dailyRetro) => !!dailyRetro[from]);
        fromIndex = fromIndexTemp === -1
            ? dailyRetros.findIndex(isObjectsKeyBiggerDateThan(from))
            : fromIndexTemp;
    }

    let toIndex: number;
    if (!to || isNaN((new Date(to)).getTime())) {
        toIndex = dailyRetros.length;
    }
    else if (from === to ) {
        toIndex = fromIndex + 1;
    }
    else {
        const toIndexTemp = dailyRetros.findIndex((dailyRetro) => !!dailyRetro[to]);
        toIndex = toIndexTemp === -1
            ? dailyRetros.findIndex(isObjectsKeyBiggerDateThan(to))
            : toIndexTemp + 1;
    }

    const dailyRetrosFromTo = dailyRetros.slice(fromIndex, toIndex);
    return dailyRetrosFromTo.length ? dailyRetrosFromTo : [EMPTY_TEMPLATE_NESTED];
};


/**
 * write methods
 */
type writeType = (newDailyRetro: dailyRetro) => void;
export const write: writeType = (newDailyRetro) => {

    const data = require(DATA_PATH);

    const currentDate = (new Date()).toLocaleDateString('en-GB');
    const lastIndex = data.dailyRetro.length - 1;
    if (data.dailyRetro.length && data.dailyRetro[lastIndex][currentDate]) {
        data.dailyRetro[lastIndex][currentDate] = newDailyRetro;
    }
    else {
        data.dailyRetro.push({ [currentDate]: newDailyRetro });
    }

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};
