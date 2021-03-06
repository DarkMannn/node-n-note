import * as Inquirer from 'inquirer';
import * as FileService from '../file-service';
import { otherFlags } from '../types';

/**
 * read sub-branch logic
 */

type dailyRetroNested = FileService.dailyRetro.dailyRetroNested;

type _dailyRetroReadType = (otherFlags: otherFlags) => void;
const _dailyRetroRead: _dailyRetroReadType = (otherFlags) => {

    let result: dailyRetroNested[] | string[];
    if (otherFlags.list) {
        const n = parseInt(otherFlags.list);
        result = FileService.dailyRetro.readLastN(n);
    }
    else if (otherFlags.type) {
        const type = otherFlags.type
        result = FileService.dailyRetro.readByType(type);
    }
    else if (otherFlags.on) {
        const date = otherFlags.on;
        result = FileService.dailyRetro.readOnDate(date);
    }
    else if (otherFlags.from) {
        const from = otherFlags.from;
        const to = otherFlags.to;
        result = FileService.dailyRetro.readFromTo(from, to);
    }
    else {
        result = FileService.dailyRetro.readLastN(10);
    }

    console.log(result);
};

/**
 * write sub-branch logic
 */
type _keys = FileService.dailyRetro.dailyRetroKeys;
type _writeQuestion = {
    type: 'input';
    name: _keys;
    message: string;
    default: string;
}
type _defaults = {
    [K in _keys]: string
}
type _makeWriteQuestionsType = (defaults: _defaults) => _writeQuestion[];
let _makeWriteQuestions: _makeWriteQuestionsType = (defaults) => ([
    {
        type: 'input',
        name: 'doNotRepeat',
        message: 'What do you need to stop doing?',
        default: defaults.doNotRepeat
    },
    {
        type: 'input',
        name: 'doRepeat',
        message: 'What do you need to continue doing?',
        default: defaults.doRepeat
    },
    {
        type: 'input',
        name: 'lessonLearned',
        message: 'What did you learn?',
        default: defaults.lessonLearned
    },
    {
        type: 'input',
        name: 'gratefulFor',
        message: 'What are you grateful for?',
        default: defaults.gratefulFor
    }
]);

type _dailyRetroWriteType = () => void;
const _dailyRetroWrite: _dailyRetroWriteType = async () => {

    const currentDailyRetro = FileService.dailyRetro.readTodayEntry();
    const questions = _makeWriteQuestions(currentDailyRetro);
    const answers = await Inquirer.prompt(questions);
    FileService.dailyRetro.write(answers);
}

/**
 * main function
 */
type dailyRetroType = (readOrWrite: 'r' | 'w', otherFlags: otherFlags) => void;
const dailyRetro: dailyRetroType =
    (readOrWrite, otherFlags) => readOrWrite === 'r' ? _dailyRetroRead(otherFlags) : _dailyRetroWrite();

export default dailyRetro;
