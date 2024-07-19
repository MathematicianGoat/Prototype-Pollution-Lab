const express = require('express');
const fs = require('node:fs');
const path = require('path');
const router = express.Router();
const Debug = require('../workers/Debug');
const { setupMock, restoreMock, addMockFile, deleteMockFile } = require('../workers/filesystem');
const { listFiles, listAllDirs, fullPathExtractor } = require('../workers/lister');





function isObject(obj) {
  return obj !== null && (typeof obj === 'object' || typeof obj === 'function');
}

function merge(target, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(target[key]) && isObject(source[key])) {
    
        if (target[key] !== source[key]) {
          merge(target[key], source[key]);
        }
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}


router.get('/', (req, res) => {
  return res.sendFile(path.resolve('views/index.html'));
});

let list = [];
let cwd = 'mocksys/root/home';
router.post('/api/commands', (req, res) => {
  
  try{
    setupMock();
    
    let all_dirs = listAllDirs();
    let user_command = req.body.command;
    let user_dir = req.body.dir;
    if ( user_command == 'cd'){
      if (all_dirs.includes(user_dir)){
        cwd = fullPathExtractor(user_dir);
        cwd = "mocksys/" + cwd;
        console.log(cwd);

      }
    }
    else if(user_command == 'pwd'){
      
    }
    else if(user_command == 'ls'){
      temp_cwd = cwd;
      if(user_dir == ''){
      list = listFiles(cwd);
      }
      else if(all_dirs.includes(user_dir)){
      list = listFiles(temp_cwd);
      }
      else{
      list = ['U good bro?'];
      }
    }
    else if(user_command == 'touch'){
      add_file = cwd + '/' + user_dir;
      console.log(add_file);
      addMockFile(add_file);
    }
    else if(user_command == 'rm'){
      del_file = cwd + '/' + user_dir;
      deleteMockFile(del_file);
    }
  } catch (error){
    res.status(500).json({ error: error.message });
  } finally{
    res.json({"cwd":cwd,"list":list});
    restoreMock();
  }

});

router.get('/api/filesystem',(req,res) => {
  fs.readFile('temp/files.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json(data);
  });
});


router.post('/data', (req, res) => {
  let data = {};
  merge(data, req.body);
  console.log('received');
  res.json(data);
});

router.get('/pollution', (req, res) => {
  a = Debug.execute();
  res.send(`Polluted property: ${Object.prototype}`);
  return a;
});

module.exports = router;