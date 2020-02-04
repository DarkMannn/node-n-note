import * as Inquirer from 'inquirer';
import * as FileService from '../utils/file-service';

interface question {
    type: 'input';
    name: 'tag' | 'note';
    message: string;
    default: string;
}
let _makeQuestions: (existingTags: string[]) => question[];
_makeQuestions = (existingTags) => ([
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

type _classicNoteReadType = () => void;
const _classicNoteRead: _classicNoteReadType = () => {

    console.log('Classic Note read');
};

type _classicNoteWriteType = () => void;
const _classicNoteWrite: _classicNoteWriteType = async () => {

    const existingTags = FileService.readClassinNoteTags();
    const questions = _makeQuestions(existingTags);
    const answers = await Inquirer.prompt(questions);
    FileService.writeClassicNote(answers);
};

type classicNoteType = (readOrWrite: 'r' | 'w') => void;
const classicNote: classicNoteType =
    (readOrWrite) => readOrWrite === 'r' ? _classicNoteRead() : _classicNoteWrite();

export default classicNote;
