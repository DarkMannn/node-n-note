var Program = require('commander');
var SubPrograms = require('./sub-programs');

Program
    .option('-n, --note', 'a classic note')
    .option('-j, --journal', 'a longer note i.e. journal')
    .option('-d, --daily-retro', 'a daily retrospection note')
    .parse(process.argv)
;

if (Program.journal) {
    SubPrograms.journal();
}
else if (Program.dailyRetro) {
    SubPrograms.dailyRetro();
}
