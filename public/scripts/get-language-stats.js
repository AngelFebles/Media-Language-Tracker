window.onload = async function () {

    try {
        const response = await fetch("http://localhost:3000/api/media/stats/language");
        const data = await response.json();

        const stats = data.stats; // array of { language, count, percentage }

        console.log(stats);

        if (stats.length === 0) {
            return;
        }
        // Prepare data for Chart.js
        const labels = stats.map(stat => stat.language);
        const no_of_entries = stats.map(stat => stat.count);

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
                            color: 'green'
                        }

                    },
                }
            }
        });

    } catch (error) {
        console.error("Error fetching language stats:", error);
    }
};
