window.addEventListener('load',function(){
    
    let url = "http://" + location.host + "/api/filesystem"
    async function api(){

        try{
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                }
              })
            const data = await response.json();
            return data;
            
        }
        catch (error){
            console.error(error);
        }
    
    }


    api().then(data => {
        let obj = JSON.parse(data)
        var keys = [];

        for(var key in obj.mocksys.root.home.Mathematician.Desktop){
            keys.push(key);
        }
        let clickable = true;
        keys.forEach(element => {

            var created_icon = document.createElement("div");
            created_icon.style.cssText='width: 48px;height: 56px;border: none;'
            document.getElementById("icons").appendChild(created_icon);

            var icon_pic = document.createElement("div");
            icon_pic.style.cssText='background-image:url("public/images/file.png");width:48px;height:48px;background-repeat: no-repeat;'
            created_icon.appendChild(icon_pic);

            var file_name = document.createElement("p");
            file_name.style.cssText='text-align: center;font-family:"Press Start 2P",cursive;font-size:8px;color:#00ff00;height:8px;background-color:none;word-break: break-all;'
            file_name.textContent = element;
            
            if(element == "creds.txt"){
                
                created_icon.addEventListener('click', function creds(){
                    if(!clickable){
                        return;
                    }
                   
                    clickable = false;
                    var content = document.createElement("div");
                    content.style.cssText='width: 100px;height: 100px;margin-left:15px;background-color:black;color:aliceblue;border:2px solid #00ff00;border-radius:5%;border-color:#00ff00;'
                    document.getElementById("file-container").appendChild(content);
            
                    var ctx = document.createElement("p");
                    ctx.style.cssText = 'font-family:"Press Start 2P",cursive;font-size:8px;margin-left:5px;word-break: break-all;'
                    ctx.textContent = 'John_Anglin:123'
                    content.appendChild(ctx);

                    var task = document.createElement("div");
                    task.className = "task";
                    task.style.cssText = 'background-image:url("public/images/file.png");background-repeat: no-repeat;background-position:center;';
                    document.getElementById("taskbar").appendChild(task);

                    content.addEventListener('click',function close(){ctx.remove();content.remove();clickable=true;task.remove();})
                    
                });
            }
            created_icon.appendChild(file_name);

        });
    });
    

});