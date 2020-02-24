#!/usr/bin/env node

import * as DotEnv from 'dotenv';
import * as FileService from './file-service'
const result = DotEnv.config({ path: `${FileService.utils.NNN_DIR}/.env` });
if (result.error) {
    throw Error(`Error in reading the .env file: ${result.error.message}`);
}

import * as Program from 'commander';
import * as GDriveService from './gdrive-service';
import * as SubPrograms from './sub-programs';
import { Id, otherFlags } from './types';

type mainFlags = {
    journal?: boolean,
    dailyRetro?: boolean,
    note?: boolean
};
type flags = Id<mainFlags & otherFlags>;
type executeProgramType = (readOrWrite: 'r' | 'w', flags: flags) => void;
const executeProgram: executeProgramType = async (readOrWrite, { journal, dailyRetro, note, ...otherFlags }) => {

    if (journal) {
        await SubPrograms.journal(readOrWrite, otherFlags);
    }
    else if (dailyRetro) {
        await SubPrograms.dailyRetro(readOrWrite, otherFlags);
    }
    else if (note) {
        await SubPrograms.classicNote(readOrWrite, otherFlags);
    }

    if (readOrWrite === 'w') {
        console.log('Creating a backup on GDrive.');
        await GDriveService.makeDataBackup();
    }
};

/**
 * setup folder structure if needed
 */
FileService.utils.defineFolderAndFilesIfFirstTime();

/**
 * define main program help
 */
Program
    .name('nnn')
    .usage('read/write [options]')
    .on('--help', () => {
        console.log(`
            Examples:
            $ nnn write -j               (write a journal entry)
            $ nnn write -d               (same but for daily retrospection note)
            $ nnn write -n               (same but only a classic note)
            $ nnn read -j                (read last 10 (default) journal entries)
            $ nnn read -d -l 5           (read last 5 daily retrospection entries)
            $ nnn read -n -a shopping    (read classin note entries with the 'shopping' tag)
        `)
    });

/**
 * define read subprogram
 */
Program
    .command('read')
    .description(
        'Read a journal entry, daily retrospection notes or classic notes based on arguments and filtering\n'
        + 'One of -j/-d/-n flags is mandatory'
    )
    .option('-j, --journal', 'a longer note i.e. journal (one of three mandatory flags -j/-d/-n)')
    .option('-d, --daily-retro', 'a daily retrospection note (one of three mandatory flags -j/-d/-n)')
    .option('-n, --note', 'a classic tagged note (one of three mandatory flags -j/-d/-n)')
    .option('-l, --list <number>', 'number of last items to show')
    .option('-o, --on <dd/mm/yyyy>', 'exact date to filter by')
    .option('-f, --from <dd/mm/yyyy>', 'start date to filter from')
    .option('-t, --to <dd/mm/yyyy>', 'end date to filter to (defaults to today)')
    .option('-y, --type <doRepeat|doNotRepeat|lessonLearned|gratefulFor>', 'dailyRetro type to filter dailyRetro notes by')
    .option('-a, --tag <tag>', 'tag to filter classic notes by')
    .action((cmdObj) => {

        executeProgram('r', cmdObj);
    });

/**
 * define write subprogram
 */
Program
    .command('write')
    .description('Write a journal entry, daily retrospection notes or a basic note')
    .option('-j, --journal', 'a longer note i.e. journal')
    .option('-d, --daily-retro', 'a daily retrospection note')
    .option('-n, --note', 'a classic tagged note')
    .action((cmdObj) => {

        executeProgram('w', cmdObj);
    });

/**
 * parse the executed command
 */
Program.parse(process.argv);
