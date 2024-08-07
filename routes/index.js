const express = require('express');
const fs = require('node:fs');
const path = require('path');
const router = express.Router();
const Debug = require('../workers/Debug');
const { setupMock, restoreMock, addMockFile, deleteMockFile } = require('../workers/filesystem');
const { listFiles, listAllDirs, fullPathExtractor } = require('../workers/lister');
const mock = require('mock-fs');




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

function appender(new_command){

  fs.readFile('temp/history.txt', 'utf8', (err, data) => { 
    if (err) throw err; 
 
    new_command = new_command + "\n";
    const updatedContent = data + new_command; 
 
    fs.writeFile('temp/history.txt', updatedContent, (err) => { 
        if (err) throw err; 
    }); 
  });
}




router.get('/', (req, res) => {
  return res.sendFile(path.resolve('views/index.html'));
});

let list = [];
let cwd = 'mocksys/root/home';
let command_error = "";
let history = "";
router.post('/api/commands', (req, res) => {
  
  try{
    setupMock();
    
    let all_dirs = listAllDirs();
    let user_command = req.body.command;
    let user_dir = req.body.dir;
  
    if ( user_command == 'cd'){
      data = {};
      history = merge(data,req.body);
      history = history["command"] + " " + history["dir"];

      if (all_dirs.includes(user_dir)){
        cwd = fullPathExtractor(user_dir);
        cwd = "mocksys/" + cwd;
      }
    }
    else if(user_command == 'pwd'){
      data = {};
      history = merge(data,req.body);
      history = history["command"] + " " + history["dir"];
    }
    else if(user_command == 'ls'){
      data = {};
      history = merge(data,req.body);
      history = history["command"] + " " + history["dir"];
      if(user_dir == ''){
        list = listFiles(cwd);
      }
      else if(all_dirs.includes(user_dir)){
        ls_path = "mocksys/" + fullPathExtractor(user_dir);
        list = listFiles(ls_path);
      }
      else{
        list = ['U good bro?'];
      }
    }
    else if(user_command == 'touch'){
      data = {};
      history = merge(data,req.body);
      history = history["command"] + " " + history["dir"];
      add_file = cwd + '/' + user_dir;
      console.log(add_file);
      addMockFile(add_file);
    }
    else if(user_command == 'rm'){
      data = {};
      history = merge(data,req.body);
      history = history["command"] + " " + history["dir"];
      del_file = cwd + '/' + user_dir;
      command_error = deleteMockFile(del_file);
    }
    else if(user_command == "history"){
      history = mock.bypass(() => fs.readFileSync('temp/history.txt', 'utf8'));
    }
   } catch (error){
    res.status(500).json({ error: error.message });
  } finally{
    if(req.body.command == "history"){
      res.json({"history":history});
    }
    else{
      res.json({"cwd":cwd,"list":list,"error":command_error});
    }
    
    command_error = "";
    restoreMock();
  }
  appender(history);
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

router.get('/api/clear-history', (req, res) => {
  a = Debug.execute();
  res.json({"message":"History cleared!"});
  return a;
});

module.exports = router;