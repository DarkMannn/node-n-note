import * as Path from 'path';

export const DATA_PATH = Path.join(__dirname, '../../data/data.json');

type _obj = { [key: string]: any };
type isObjectsKeyBiggerDateThan = (date: string) => (obj: _obj) => boolean;
export const isObjectsKeyBiggerDateThan: isObjectsKeyBiggerDateThan =
    (date) =>
        (obj) => (new Date(Object.keys(obj)[0]).getTime()) > (new Date(date)).getTime();
