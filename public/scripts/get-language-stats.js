window.onload = async function () {

    try {

        // Get Language Stats
        const response = await fetch("http://localhost:3000/api/media/stats/language");
        const data = await response.json();

        const stats = data.stats; // array of { language, count, percentage }
        // console.log(stats);

        // Get Media List
        const response_media_list = await fetch("http://localhost:3000/api/list_media");
        const data_media_list = await response_media_list.json();
        // console.log('a');
        // console.log(data_media_list.media);

        if (stats.length === 0) {

            const error_box = document.createElement("div");
            error_box.className = 'error_box';
            this.document.getElementsByClassName("wrapper")[0].appendChild(error_box);

            const error_message1 = document.createElement("h1");
            error_message1.innerHTML = "Nobody here but us chikens!";

            const error_message2 = document.createElement("h3");
            error_message2.innerHTML = "(Empty table, try adding a new entry!)"

            // const chart_element = document.getElementById("myChart").getContext("2d");
            // chart_element.remove;

            this.document.getElementsByClassName("error_box")[0].appendChild(error_message1);
            this.document.getElementsByClassName("error_box")[0].appendChild(error_message2);

            return;
        }

        // Entries List
        tableFromJson(data_media_list.media);


        // Prepare data for Chart.js
        const labels = stats.map(stat => stat.language);
        const no_of_entries = stats.map(stat => stat.count);

        const canvas_element = document.createElement("canvas");
        canvas_element.id = "myChart";
        this.document.getElementsByClassName("wrapper")[0].appendChild(canvas_element);

        const ctx = document.getElementById("myChart").getContext("2d");

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Entries',
                    data: no_of_entries,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom',


                        title: {
                            display: true,
                            text: 'Languages',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: 5,
                            color: 'white'
                        }

                    },
                }
            }
        });

    } catch (error) {
        console.error("Error fetching language stats:", error);


        const error_box = document.createElement("div");
        error_box.className = 'error_box';
        this.document.getElementsByClassName("wrapper")[0].appendChild(error_box);

        const error_message1 = document.createElement("h1");
        error_message1.innerHTML = "Nobody here but us chikens!";

        const error_message2 = document.createElement("h3");
        error_message2.innerHTML = "(There was an error contacting the database)"

        // const chart_element = document.getElementById("myChart").getContext("2d");
        // chart_element.remove;

        this.document.getElementsByClassName("error_box")[0].appendChild(error_message1);
        this.document.getElementsByClassName("error_box")[0].appendChild(error_message2);


        // add the newly created element and its content into the DOM

        // const currentDiv = document.getElementById("wrapper");
        // document.body.insertBefore(newDiv, currentDiv);
    }


};

let tableFromJson = (json_file) => {

    const table_box = document.createElement("div");
    table_box.id = 'showData';
    this.document.getElementsByClassName("wrapper")[0].appendChild(table_box);



    const table = document.createElement("table");    // Create table element.
    let tr = table.insertRow(-1);                   // table row.

    let col = Object.keys(json_file[0]);
    console.log(col);

    col.forEach((item) => {
        let th = document.createElement("th");      // table header.
        th.innerHTML = item;
        tr.appendChild(th);
    });

    // add json data to the table as rows.
    json_file.forEach((item) => {
        tr = table.insertRow(-1);

        let val = Object.values(item);

        val.forEach((element) => {
            let tabCell = tr.insertCell(-1);
            tabCell.innerHTML = element;
        });
    });

    // Finally, add the newly created table with json data, to a container.
    const divShowData = document.getElementById('showData');
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
}