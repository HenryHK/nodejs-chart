google.charts.load('current', { packages: ['corechart'] });

var options = {
    'title': "Pie Chart",
    'width': 400,
    'height': 300
};
var data
var pData;

function drawPie() {
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Element');
    graphData.addColumn('number', 'Percentage');
    $.each(pData, function(key, val) {
        graphData.addRow([key, val]);
    })
    var chart = new google.visualization.PieChart($("#myChart")[0]);
    chart.draw(graphData, options);
}

$(document).ready(function() {

    $.get('/OverallData', null, function(rdata) {
        console.log(rdata);
        data = rdata;
        var pie = {};
        var pieData = JSON.parse(data.pieChartData);
        console.log(typeof(data.pieChartData))
        console.log(typeof(pieData));
        for (var a of pieData) {
            if (a.type === null)
                pie["anonymous"] = a.count;
            else
                pie[a.type] = a.count
        }
        pData = pie;
        drawPie();
    });

    $("#pie").on('click', function(event) {
        event.preventDefault();
        drawPie();
    })

    $("#bar").on('click', function(event) {
        event.preventDefault();
        $("#myChart").html("");
    })

});