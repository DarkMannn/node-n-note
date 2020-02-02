import * as Inquirer from 'inquirer';
import * as FileService from '../utils/file-service';

interface question {
    type: 'input';
    name: 'doRepeat' | 'doNotRepeat' | 'lessonLearned' | 'gratefulFor';
    message: string;
    default: string;
}
let questionsTemplates: question[] = [
    {
      type: 'input',
      name: 'doNotRepeat',
      message: 'What do you need to stop doing?',
      default: ''
    },
    {
      type: 'input',
      name: 'doRepeat',
      message: 'What do you need to continue doing?',
      default: ''
    },
    {
      type: 'input',
      name: 'lessonLearned',
      message: 'What did you learn?',
      default: ''
    },
    {
      type: 'input',
      name: 'gratefulFor',
      message: 'What are you grateful for?',
      default: ''
    }
];

let dailyRetro: () => void;
dailyRetro = async function() {

    const currentDailyRetro = FileService.readDailyRetro();
    const questions = questionsTemplates.map((questionTemplate) => {

        const isAnswerAlreadyEntered = !!currentDailyRetro[questionTemplate.name];
        if (!isAnswerAlreadyEntered) {
            return { ...questionTemplate };
        }

        const existingAnswer = currentDailyRetro[questionTemplate.name];
        const modifiedProps = { default: existingAnswer };
        return { ...questionTemplate, ...modifiedProps };
    });
    const answers = await Inquirer.prompt(questions);
    FileService.writeDailyRetro(answers);
};

export default dailyRetro;
