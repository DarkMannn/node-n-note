import * as Path from 'path';
import * as Fs from 'fs';
import * as Os from 'os';
import { AssertionError } from 'assert';

export const NNN_DIR = Path.join(Os.homedir(), '/.nnn');
export const DATA_PATH = Path.join(NNN_DIR, '/data.json');

type _obj = { [key: string]: any };
type isObjectsKeyBiggerDateThan = (date: string) => (obj: _obj) => boolean;
export const isObjectsKeyBiggerDateThan: isObjectsKeyBiggerDateThan =
    (date) =>
        (obj) => (new Date(Object.keys(obj)[0]).getTime()) > (new Date(date)).getTime();

type defineFolderAndFilesIfFirstTimeType = () => void;
export const defineFolderAndFilesIfFirstTime: defineFolderAndFilesIfFirstTimeType = () => {

    if (!Fs.existsSync(NNN_DIR)) {
        Fs.mkdirSync(NNN_DIR);
        try {
            const emptyTemplate = {
                journal: [],
                dailyRetro: [],
                classicNote: {}
            };
            Fs.writeFileSync(DATA_PATH, JSON.stringify(emptyTemplate), { flag: 'wx' });
        } catch {}
    }
};

type _assertIsObjectType = (potentialObj: any) => asserts potentialObj is object;
const _assertIsObject: _assertIsObjectType = (potentialObj) => {

    if (potentialObj === null || typeof (potentialObj) !== 'object') {
        throw new AssertionError({ message: 'Not an object' });
    }
};

type readFromAppDirType = (filename: string) => object | null;
export const readFromAppDir: readFromAppDirType = (filename) => {

    let fileParsed;
    try {
        const filepath = Path.join(NNN_DIR, filename);
        const file = Fs.readFileSync(filepath, 'utf8');
        fileParsed = JSON.parse(file);
        _assertIsObject(fileParsed);
    }
    catch {
        return null;
    }
    return fileParsed;
};

type writeToAppDirType = (filename: string, data: object) => void;
export const writeToAppDir: writeToAppDirType = (filename, data) => {

    const filepath = Path.join(NNN_DIR, filename);
    Fs.writeFileSync(filepath, JSON.stringify(data));
};
