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

let classicNote: () => void;
classicNote = async function () {

    const existingTags = FileService.readClassinNoteTags();
    const questions = _makeQuestions(existingTags);
    const answers = await Inquirer.prompt(questions);
    FileService.writeClassicNote(answers);
};

export default classicNote;
