var Inquirer = require('inquirer');
var FileService = require('../utils/file-service.ts');

interface question {
    type: string;
    name: string;
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
dailyRetro = async () => {

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

module.exports = dailyRetro;
