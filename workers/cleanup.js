const fs = require('fs');

fs.writeFile('temp/history.txt', '', (err) => { 
    if (err) throw err; 
});