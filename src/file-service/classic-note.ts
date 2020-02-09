import * as Fs from 'fs';
import { DATA_PATH } from './internals';

interface classicNote {
    tag: string;
    note: string;
}

/**
 * read methods
 */
type readTagsType = () => string[];
export const readTags: readTagsType = () => {

    const data = require(DATA_PATH);
    const tags = Object.keys(data.classicNote);
    return tags;
};

/**
 * write methods
 */
type writeType = (newClassicNote: classicNote) => void;
export const write: writeType = (newClassicNote) => {

    const data = require(DATA_PATH);

    if (Array.isArray(data.classicNote[newClassicNote.tag])) {
        data.classicNote[newClassicNote.tag].push(newClassicNote.note);
    }
    else {
        data.classicNote[newClassicNote.tag] = [newClassicNote.note];
    }

    Fs.writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8');
};
