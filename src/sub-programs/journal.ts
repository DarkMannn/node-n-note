let ChildProcess = require('child_process')
let Fs = require('fs').promises;
let Uuid = require('uuid');

const editor: string = process.env.EDITOR || 'nano';
const TEMP_DIR: string = '/tmp/nnn'

let journal: () => Promise<void>;
journal = async () => {

    await Fs.mkdir(TEMP_DIR, { recursive: true });

    const tempFilePath = `${TEMP_DIR}/${Uuid.v1()}`;
    ChildProcess.spawnSync(editor, [tempFilePath], {
        stdio: 'inherit'
    });

    const newJournalEntry = await Fs.readFile(tempFilePath, 'utf8');

    // TODO: write in the json file
    console.log(newJournalEntry);
};

module.exports = journal;
