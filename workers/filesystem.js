const mock = require('mock-fs');
const fs = require('fs');
var filesys = require('../temp/files.json');
const { file } = require('mock-fs/lib/filesystem');

function setupMock(){
    mock(filesys);
}
function addMockFile(usrpath){
    
    const parts = usrpath.split('/');

    let the_path  = '';
    let temp = parts[0];
    
    for (let i = 1; i < parts.length-1; i++) {
        
        the_path = the_path + "." + parts[i];

    }
    the_path = temp + the_path + `["${parts[parts.length-1]}"]`;
        
    eval(`filesys.${the_path} = 'This is a file'`);
    mock.bypass(()=>fs.writeFile('temp/files.json',JSON.stringify(filesys),(err)=>{if(err){console.log(err)}}));

}

function deleteMockFile(usrpath){
    let parts0 = usrpath.split('/');
    let parts = parts0.splice(0,parts0.length-1).join("/");
    
    const files = fs.readdirSync(parts, { withFileTypes: true });
    
    let the_path  = '';
    let files_list = [];

    the_path = usrpath.split('/').splice(0,usrpath.split('/').length-1).join(".") + `["${usrpath.split('/')[usrpath.split('/').length-1]}"]`;
   
    console.log(the_path);
    command_error = "";

    files.forEach(file => {
        files_list.push(file.name);

        if(!file.isDirectory() && usrpath.endsWith(file.name)){
            
            eval(`delete filesys.${the_path}`);
            mock.bypass(()=>fs.writeFile('temp/files.json',JSON.stringify(filesys),(err)=>{if(err){console.log(err)}}));
            command_error = null;
        }
        else if(file.isDirectory() && usrpath.endsWith(file.name)){
            
            command_error = `${file.name} is a directory`;
        }
        
    });

    if(!(files_list.includes(parts0[0]))){
        command_error = "File doesn't exist";            
    }

    return command_error;
    
}

function restoreMock(){
    mock.restore();
}

module.exports = { setupMock,restoreMock,addMockFile,deleteMockFile };