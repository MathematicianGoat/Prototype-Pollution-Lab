const fs = require('fs');
const path = require('path');

module.exports = {
    foo: function(){
        console.log("test");
    },
    listFiles: function (dir) {

        let l_all = [];
        try {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            l_all.push(file);
          });
          return l_all
        } catch (err) {
          console.error(`Error reading directory ${dir}: ${err.message}`);
        }
      },
    listAllDirs: function () {
        const dirs = [];
        var full_path = '';
        function traverse(currentPath) {
            const entries = fs.readdirSync(currentPath, { withFileTypes: true });
            
            entries.forEach(entry => {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                dirs.push(entry.name);
                traverse(fullPath);
            }
            });
        }
        traverse('mocksys');
        return dirs;
    },
    fullPathExtractor: function(cwd){
        var full_path = '';
        function traverse(currentPath) {
            const entries = fs.readdirSync(currentPath, { withFileTypes: true });
            
            entries.forEach(entry => {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                
                if(entry.name.endsWith(cwd)){
                    full_path = fullPath;
                }
                traverse(fullPath) 
            }
            });
        }
        traverse('mocksys');
        return full_path.split("/").splice(1,full_path.length).join("/");
    }
};