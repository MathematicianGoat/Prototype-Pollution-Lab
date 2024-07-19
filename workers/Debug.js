const { fork } = require('child_process');

module.exports = {
    execute(){
        // let proc = fork('./cleanup.js',[],{stdio:['ignore','pipe','pipe','ipc']});
        // proc.stderr.pipe(res);
        // proc.stdout.pipe(res);
        let proc = fork('workers/cleanup.js');
       
        return;
    }
}
