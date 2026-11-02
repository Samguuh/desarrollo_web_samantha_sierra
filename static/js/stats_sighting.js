Highcharts.chart('pie-container', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Cantidad por tipo'
    },
    tooltip: {
        pointFormat: '<b>{point.y}</b> unidades ({point.percentage:.1f}%)'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y}'
            }
        }
    },
    series: [{
        name: 'Cantidad',
        colorByPoint: true,
        data: []
    }]
});

fetch("http://127.0.0.1:5000/get-stats-data")
  .then((response) => response.json())
  .then((data) => {
    let parsedData = data.pie_data.map((item) => ({
      name: item.label,
      y: item.count,
    }));

    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "pie-container"
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