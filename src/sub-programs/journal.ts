import * as ChildProcess from 'child_process';
import * as Fs from 'fs';
import * as Uuid from 'uuid';
import * as FileService from '../utils/file-service';
import { otherFlags } from '../types';

const editor: string = process.env.EDITOR || 'nano';
const TEMP_DIR: string = '/tmp/nnn' // node-n-note

type _journalReadType = (otherFlags: otherFlags) => void;
const _journalRead: _journalReadType = (otherFlags) => {

    console.log('Journal read');
    console.log(otherFlags);
};

type _journalWriteType = () => void;
const _journalWrite: _journalWriteType = () => {

    Fs.mkdirSync(TEMP_DIR, { recursive: true });

    const tempFilePath = `${TEMP_DIR}/${Uuid.v1()}`;
    ChildProcess.spawnSync(editor, [tempFilePath], { stdio: 'inherit' });

    const newJournalEntry = Fs.readFileSync(tempFilePath, 'utf8');
    FileService.writeJournal(newJournalEntry);
};

type journalType = (readOrWrite: 'r' | 'w', otherFlags: otherFlags) => void;
const journal: journalType =
    (readOrWrite, otherFlags) => readOrWrite === 'r' ? _journalRead(otherFlags) : _journalWrite();

export default journal;
