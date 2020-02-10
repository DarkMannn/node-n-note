import * as Inquirer from 'inquirer';
import * as FileService from '../file-service';
import { otherFlags } from '../types';

/**
 * read sub-branch logic
 */
type classicNote = FileService.classicNote.classicNote;

type _classicNoteReadType = (otherFlags: otherFlags) => void;
const _classicNoteRead: _classicNoteReadType = (otherFlags) => {

    let result: string[] | classicNote;
    if (otherFlags.list) {
        result = FileService.classicNote.readTags();
    }
    else if (otherFlags.tag) {
        const tag = otherFlags.tag
        result = FileService.classicNote.readByTag(tag);
    }
    else {
        result = FileService.classicNote.readAll();
    }

    console.log(result);
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
