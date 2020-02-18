import * as Fs from 'fs';
import { DATA_PATH } from './utils';

type classicNotePrompt = {
    tag: string;
    note: string;
}
export type classicNote = {
    [key: string]: string[]
};

/**
 * read methods
 */
type readTagsType = () => string[];
export const readTags: readTagsType = () => {

    const data = require(DATA_PATH);
    const tags = Object.keys(data.classicNote);
    return tags;
};

type readByTagType = (tag: string) => string[];
export const readByTag: readByTagType = (tag) => {

    const data = require(DATA_PATH);
    const classicNotes: classicNote = data.classicNote;
    return classicNotes[tag] || ['Not Found'];
};

type readAllType = () => classicNote;
export const readAll: readAllType = () => {

    const data = require(DATA_PATH);
    const classicNotes: classicNote = data.classicNote;
    return classicNotes;
};

/**
 * write methods
 */
type writeType = (newClassicNote: classicNotePrompt) => void;
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
