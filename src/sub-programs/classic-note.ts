import * as Inquirer from 'inquirer';
import * as FileService from '../file-service';
import { otherFlags } from '../types';

/**
 * read sub-branch logic
 */
type _classicNoteReadType = (otherFlags: otherFlags) => void;
const _classicNoteRead: _classicNoteReadType = (otherFlags) => {

    console.log('Classic Note read');
    console.log(otherFlags);
};

/**
 * write sub-branch logic
 */
type question = {
    type: 'input';
    name: 'tag' | 'note';
    message: string;
    default: string;
}
type _makeQuestionsType = (existingTags: string[]) => question[];
const _makeQuestions: _makeQuestionsType = (existingTags) => ([
    {
        type: 'input',
        name: 'tag',
        message: `Choose a tag or enter a new one (existing tags: ${existingTags}):`,
        default: 'default'
    },
    {
        type: 'input',
        name: 'note',
        message: 'Enter your note:',
        default: ''
    }
]);

type _classicNoteWriteType = () => void;
const _classicNoteWrite: _classicNoteWriteType = async () => {

    const existingTags = FileService.classicNote.readTags();
    const questions = _makeQuestions(existingTags);
    const answers = await Inquirer.prompt(questions);
    FileService.classicNote.write(answers);
};

/**
 * main function
 */
type classicNoteType = (readOrWrite: 'r' | 'w', otherFlags: otherFlags) => void;
const classicNote: classicNoteType =
    (readOrWrite, otherFlags) => readOrWrite === 'r' ? _classicNoteRead(otherFlags) : _classicNoteWrite();

export default classicNote;
