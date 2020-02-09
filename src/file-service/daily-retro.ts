import * as Fs from 'fs';
import { DATA_PATH } from './internals';

interface dailyRetro {
    doRepeat: string;
    doNotRepeat: string;
    lessonLearned: string;
    gratefulFor: string;
}

/**
 * read methods
 */
type readType = () => dailyRetro;
export const read: readType = () => {

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
