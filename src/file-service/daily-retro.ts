import * as Fs from 'fs';
import { DATA_PATH } from './internals';

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

    const currentDate = (new Date()).toLocaleDateString();
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
    return dailyRetros.map((dailyRetro) => Object.values(dailyRetro)[0][type]);
};

/**
 * write methods
 */
type writeType = (newDailyRetro: dailyRetro) => void;
export const write: writeType = (newDailyRetro) => {

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
