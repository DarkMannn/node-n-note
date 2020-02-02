import * as ChildProcess from 'child_process';
import * as Fs from 'fs';
import * as Uuid from 'uuid';
import * as FileService from '../utils/file-service';

const editor: string = process.env.EDITOR || 'nano';
const TEMP_DIR: string = '/tmp/nnn' // node-n-note

let journal: () => void;
journal = function () {

    Fs.mkdirSync(TEMP_DIR, { recursive: true });

    const tempFilePath = `${TEMP_DIR}/${Uuid.v1()}`;
    ChildProcess.spawnSync(editor, [tempFilePath], { stdio: 'inherit' });

    const newJournalEntry = Fs.readFileSync(tempFilePath, 'utf8');
    FileService.writeJournal(newJournalEntry);
};

export default journal;
