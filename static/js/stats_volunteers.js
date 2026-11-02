Highcharts.chart("barr-container", {
  chart: {
    type: "column",
  },
  title: {
    text: "Voluntarios por comuna",
  },
  xAxis: {
    type: "category",
    title: {
      text: "Comuna",
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "Cantidad de voluntarios",
    },
    allowDecimals: false,
  },
  tooltip: {
    pointFormat: "<b>{point.y}</b> voluntarios",
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
      },
    },
  },
  series: [
    {
      name: "Voluntarios",
      data: [],
      color: "#2f7ed8",
    },
  ],
  accessibility: {
    enabled: true,
  },
});

fetch("http://127.0.0.1:5000/get-stats-data")
  .then((response) => response.json())
  .then((data) => {
    let parsedData = data.barr_data.map((item) => ({
        name: item.comune,
        y: item.volunteers
    }));

    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "barr-container"
    );

    chart.update({
      series: [
        {
          data: parsedData,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));