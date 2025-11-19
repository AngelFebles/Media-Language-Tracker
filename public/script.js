class TableEntry{

     constructor(name,type,language){
        this.name = name;
        this.type = type;
        this.language = language;
        // this.extra_info = extra_info;s
     }

     static reset_to_default(name, type, language) {
        name.value = "";
        type.value = "manga";
        language.value = "jp";
     }

     static get_user_input(){
        
        const name = document.getElementById("input_name");
        const type =  document.getElementById("input_type");
        const language =  document.getElementById("input_language");
        // const extra_info =  document.getElementById("input_comment").value;

        let new_entry = new TableEntry (name.value, type.value, language.value);

        TableEntry.reset_to_default(name,type,language);

        return (new_entry);
     }

    

}


document.getElementById("button-submit").addEventListener("click", 
    async function(){
        const new_entry = TableEntry.get_user_input();
        console.log(new_entry);
        
         try {
            const response = await fetch("http://localhost:3000/api/add-entry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(new_entry)
            });

            const result = await response.json();
            console.log("Server response:", result);

        } catch (error) {
            console.error("Error sending data:", error);
        }

        alert("Done!")
    }
      
)

