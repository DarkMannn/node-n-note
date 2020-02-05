import * as Program from 'commander';
import * as SubPrograms from './sub-programs';
import { Id, otherFlags } from './types';

type mainFlags = {
    journal?: boolean,
    dailyRetro?: boolean,
    note?: boolean
};
type flags = Id<mainFlags & otherFlags>;
type executeProgramType = (readOrWrite: 'r' | 'w', flags: flags ) => void;
const executeProgram: executeProgramType = (readOrWrite, { journal, dailyRetro, note, ...otherFlags }) => {

    if (journal) {
        SubPrograms.journal(readOrWrite, otherFlags);
    }
    else if (dailyRetro) {
        SubPrograms.dailyRetro(readOrWrite, otherFlags);
    }
    else if (note) {
        SubPrograms.classicNote(readOrWrite, otherFlags);
    }
};

/**
 * define read subprogram
 */
Program
    .command('read')
    .option('-j, --journal', 'a longer note i.e. journal')
    .option('-d, --daily-retro', 'a daily retrospection note')
    .option('-n, --note', 'a classic note')
    .option('-l, --list <number>', 'number of last items to show')
    .option('-o, --on <dd/mm/yyyy>', 'exact date to filter by')
    .option('-f, --from <dd/mm/yyyy>', 'start date to filter from')
    .option('-t, --to <dd/mm/yyyy>', 'end date to filter to (defaults to today)')
    .option('-y, --type <doRepeat|doNotRepeat|lessonLearned|gratefulFor>', 'dailyRetro type to filter by')
    .option('-a, --tag <tag>', 'tag to filter notes by')
    .action((cmdObj) => {

        executeProgram('r', cmdObj);
    })
;

/**
 * define write subprogram
 */
Program
    .command('write')
    .option('-j, --journal', 'a longer note i.e. journal')
    .option('-d, --daily-retro', 'a daily retrospection note')
    .option('-n, --note', 'a classic note')
    .action((cmdObj) => {

        executeProgram('w', cmdObj);
    })
;

/**
 * parse the executed command
 */
Program.parse(process.argv);
