window.addEventListener('load',function(){

    async function api(){

        try{
            const response = await fetch('http://localhost/api/filesystem', {
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
        console.log(keys);
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
            created_icon.appendChild(file_name);

        });
    });
    

});