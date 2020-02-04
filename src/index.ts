import * as Program from 'commander';
import * as SubPrograms from './sub-programs';

interface program { journal?: boolean, dailyRetro?: boolean, note?: boolean };
type executeProgramType = (readOrWrite: 'r' | 'w', flags: program) => void;
const executeProgram: executeProgramType = (readOrWrite, { journal, dailyRetro }) => {

    if (journal) {
        SubPrograms.journal(readOrWrite);
    }
    else if (dailyRetro) {
        SubPrograms.dailyRetro(readOrWrite);
    }
    else {
        SubPrograms.classicNote(readOrWrite);
    }
};

Program
    .command('read')
    .option('-j, --journal', 'a longer note i.e. journal')
    .option('-d, --daily-retro', 'a daily retrospection note')
    .option('-n, --note', 'a classic note')
    .action((cmdObj) => {

        executeProgram('r', cmdObj);
    })
;

Program
    .command('write')
    .option('-j, --journal', 'a longer note i.e. journal')
    .option('-d, --daily-retro', 'a daily retrospection note')
    .option('-n, --note', 'a classic note')
    .action((cmdObj) => {

        executeProgram('w', cmdObj);
    })
;

Program.parse(process.argv);
