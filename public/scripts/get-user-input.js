class TableEntry {

    constructor(name, type, language) {
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

    static get_user_input() {

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-full-width",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        const name = document.getElementById("input_name");
        const type = document.getElementById("input_type");
        const language = document.getElementById("input_language");
        // const extra_info =  document.getElementById("input_comment").value;

        let new_entry = new TableEntry(name.value, type.value, language.value);

        TableEntry.reset_to_default(name, type, language);

        return (new_entry);
    }



}


document.getElementById("button-submit").addEventListener("click",
    async function () {
        const new_entry = TableEntry.get_user_input();
        // console.log(new_entry.name.length);

        if (new_entry.name.length == 0) {
            toastr.error("Media has an empty name.");

        } else {
            try {
                const response = await fetch("http://localhost:3000/api/media", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(new_entry)
                });

                const result = await response.json();
                // console.log("Server response:", result);



                toastr.success("New Entry Added!!!!");

            } catch (error) {
                console.error("Error sending data:", error);
                toastr.error("Error sending data, check the logs for more information.");
            }

        }




        // alert("Done!")
    }

)

