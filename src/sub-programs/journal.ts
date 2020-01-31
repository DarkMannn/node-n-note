var ChildProcess = require('child_process')
var Fs = require('fs');
var Uuid = require('uuid');
var FileService = require('../utils/file-service.ts');

const editor: string = process.env.EDITOR || 'nano';
const TEMP_DIR: string = '/tmp/nnn' // node-n-note

let journal: () => void;
journal = () => {

    Fs.mkdirSync(TEMP_DIR, { recursive: true });

    const tempFilePath = `${TEMP_DIR}/${Uuid.v1()}`;
    ChildProcess.spawnSync(editor, [tempFilePath], { stdio: 'inherit' });

    const newJournalEntry = Fs.readFileSync(tempFilePath, 'utf8');
    FileService.writeJournal(newJournalEntry);
};

module.exports = journal;
