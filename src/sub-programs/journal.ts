import * as ChildProcess from 'child_process';
import * as Fs from 'fs';
import * as Uuid from 'uuid';
import * as FileService from '../file-service';
import { otherFlags } from '../types';

const editor: string = process.env.EDITOR || 'nano';
const TEMP_DIR: string = '/tmp/nnn' // node-n-note

/**
 * read sub-branch logic
 */
type _journalReadType = (otherFlags: otherFlags) => void;
const _journalRead: _journalReadType = (otherFlags) => {

    let result: string[];
    if (otherFlags.list) {
        const n = parseInt(otherFlags.list);
        result = FileService.journal.readLastN(n);
    }
    else if (otherFlags.on) {
        const date = otherFlags.on;
        result = FileService.journal.readOnDate(date);
    }
    else if (otherFlags.from) {
        const from = otherFlags.from;
        const to = otherFlags.to;
        result = FileService.journal.readFromTo(from, to);
    }
    else {
        result = FileService.journal.readLastN(10);
    }

    console.log(result);
};

/**
 * write sub-branch logic
 */
type _journalWriteType = () => void;
const _journalWrite: _journalWriteType = () => {

    Fs.mkdirSync(TEMP_DIR, { recursive: true });

    const tempFilePath = `${TEMP_DIR}/${Uuid.v1()}`;
    ChildProcess.spawnSync(editor, [tempFilePath], { stdio: 'inherit' });

    const newJournalEntry = Fs.readFileSync(tempFilePath, 'utf8');
    FileService.journal.write(newJournalEntry);
};

/**
 * main function
 */
type journalType = (readOrWrite: 'r' | 'w', otherFlags: otherFlags) => void;
const journal: journalType =
    (readOrWrite, otherFlags) => readOrWrite === 'r' ? _journalRead(otherFlags) : _journalWrite();

export default journal;
