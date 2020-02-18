import * as Path from 'path';
import * as Fs from 'fs';
import * as Os from 'os';

const NNN_DIR = Path.join(Os.homedir(), '/.nnn');
export const DATA_PATH = Path.join(NNN_DIR, '/data.json');

type _obj = { [key: string]: any };
type isObjectsKeyBiggerDateThan = (date: string) => (obj: _obj) => boolean;
export const isObjectsKeyBiggerDateThan: isObjectsKeyBiggerDateThan =
    (date) =>
        (obj) => (new Date(Object.keys(obj)[0]).getTime()) > (new Date(date)).getTime();

export const defineFolderAndFilesIfFirstTime = () => {

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
