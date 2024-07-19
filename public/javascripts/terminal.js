document.getElementById("terminal").addEventListener("click",function terminal(){
 
    var term_top_bar = document.createElement("div");
    term_top_bar.id = "term_top_bar";
    term_top_bar.style.cssText='display:flex;align-items:center;justify-content:left;height:25px;width:600px;background-color:black;border: 2px solid #00ff00;'
    document.getElementById("terminal-container").appendChild(term_top_bar);

    var working_dir = document.createElement("p");
    working_dir.id = "working_dir";
    working_dir.style.cssText='width:565px;height:20px;margin-left:10px;font-size:15px;'
    document.getElementById("term_top_bar").appendChild(working_dir);
    api('pwd','').then(data => {
        working_dir.textContent = data["cwd"].split("/").splice(1,data["cwd"].length).join("/");
    }).catch(error => {console.error(error)});

    var a = document.createElement("div");
    a.id = "terminal-window"
    a.style.cssText = 'display:flex;flex-direction:column;width:600px;border: 2px solid #00ff00;height:300px;overflow-y:scroll;background-color:black;'
    document.getElementById("terminal-container").appendChild(a);


    var exit = document.createElement("div");
    exit.id = "exit";
    exit.style.cssText='margin-right:auto;height:15px;width:15px;background-color:black;background-image: url("public/images/x.png");'
    document.getElementById("term_top_bar").appendChild(exit);


    var output_div = document.createElement("div");
    output_div.id = "output_div";
    output_div.className = "output"
    output_div.style.cssText = 'margin-bottom: 10px;white-space: pre-wrap;margin-left:10px;';
    document.getElementById("terminal-window").appendChild(output_div);


    var input_div = document.createElement("div");
    input_div.id = "input_div";
    input_div.style.cssText = 'display:flex;margin-left:10px;';
    document.getElementById("terminal-window").appendChild(input_div);

    var prompt = document.createElement("span");
    prompt.id = "prompt";
    prompt.style.cssText = 'color:#00ff00;';
    document.getElementById("input_div").appendChild(prompt);
    prompt.appendChild(document.createTextNode("Mathematician@root: "));

    var input = document.createElement("input");
    input.id = "input";
    input.type = "text";
    input.autofocus = true;
    input.style.cssText = 'background-color:transparent;border:none;outline:none;color:#fff;width:600px;font-family:"Press Start 2P",cursive;';
    document.getElementById("input_div").appendChild(input);
   
    appendTerminalOutput(`Welcome to U8untu!`);
    appendTerminalOutput(`Type 'help' to get the list of the commands!`);


    function appendTerminalOutput(output) {
        const outputElement = document.createElement('p');
        outputElement.textContent = output;
        let formattedText = '';
        let index = 0;
        let text = outputElement.textContent
        while (index < text.length) {
            if (index + 35 < text.length) {
                formattedText += text.slice(index, index + 35) + '\n';
            } else {
                formattedText += text.slice(index);
            }
            index += 35;
        }
        outputElement.textContent = formattedText;
        a.querySelector('.output').appendChild(outputElement);
    }


    function clearTerminal() {
        a.querySelector('.output').innerHTML = '';
    }

    input.addEventListener('keydown', function(event){
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputText = input.value.trim();
            if (inputText === 'help'){
                appendTerminalOutput(`clear           clears the terminal`);
                appendTerminalOutput(`echo           reflects the user input to the terminal`);
                appendTerminalOutput(`rm [file]      removes a file`);
                appendTerminalOutput(`touch [name]   creates a file`);
                appendTerminalOutput(`cd [dir name]  changes current working directory`);
                appendTerminalOutput(`pwd            shows current working directory`);
                appendTerminalOutput(`ls             lists the files under current working directory`);
            }
            else if (inputText === 'clear') {
                clearTerminal();
            } 
            else if (inputText.split(" ")[0] === 'echo'){
                temp_text = inputText.split(" ").splice(1,inputText.length).join(" ");
                appendTerminalOutput(`$ ${temp_text}`);
            }
            else if(inputText.split(" ")[0] === 'rm'){
                dir = inputText.split(" ").splice(1,inputText.length).join(" ");
                api('rm',dir).then(data => {
                    console.log(data);
                }).catch(error => {console.error(error)});;
            }
            else if(inputText.split(" ")[0] === 'touch'){
                dir = inputText.split(" ").splice(1,inputText.length).join(" ");
                api('touch',dir).then(data => {
                    temp = data["cwd"].split("/")
                    
                    if(temp[temp.length-1] == 'Desktop'){
                        
                        var created_icon = document.createElement("div");
                        created_icon.style.cssText='width: 48px;height: 56px;border: none;'
                        document.getElementById("icons").appendChild(created_icon);

                        var icon_pic = document.createElement("div");
                        icon_pic.style.cssText='background-color:aliceblue;width:48px;height:48px;'
                        created_icon.appendChild(icon_pic);

                        var file_name = document.createElement("p");
                        file_name.style.cssText='text-align: center;font-family:"Press Start 2P",cursive;font-size:8px;color:#00ff00;height:8px;background-color:none;word-break: break-all;'
                        file_name.textContent = inputText.split(" ").splice(1,inputText.length).join(" ");
                        created_icon.appendChild(file_name);
                    }
                    
                
                }).catch(error => {console.error(error)});
            }
            else if(inputText.split(" ")[0] === 'cd'){
                dir = inputText.split(" ").splice(1,inputText.length).join(" ");
                
                api('cd',dir).then(data => {
                    document.getElementById("working_dir").innerHTML = data["cwd"].split("/").splice(1,data["cwd"].length).join("/");
                }).catch(error => {console.error(error)});
            
            }
            else if(inputText.split(" ")[0] === 'pwd'){
                api('pwd','').then(data => {
                    appendTerminalOutput(`$ ${data["cwd"].split("/").splice(1,data["cwd"].length).join("/")}`);
                }).catch(error => {console.error(error)});
            }
            else if(inputText.split(" ")[0] === 'ls'){
                dir = inputText.split(" ").splice(1,inputText.length).join(" ");
                api('ls',dir).then(data => {
                    appendTerminalOutput(`$ ${data["list"]}`);
                }).catch(error => {console.error(error)});
            }
            else {
                appendTerminalOutput(`$ ${inputText} is not an acceptable command pal`);
            }
            input.value = '';
            
            a.scrollTop = a.scrollHeight;
        } 
    })

    exit.addEventListener("click",function exit(){a.remove();term_top_bar.remove();})
});

async function api(command,dir){

    try{
        const response = await fetch('http://localhost/api/commands', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "command": command, "dir": dir}),
          })
        const data = await response.json();
        return data;
        
    }
    catch (error){
        console.error(error);
    }

}