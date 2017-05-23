google.charts.load('current', { packages: ['corechart'] });
google.charts.load('current', { packages: ['bar'] });

var data
var pData;
var bData;

function drawPie() {
    var options = {
        'title': "Pie Chart",
        'width': 400,
        'height': 300
    };
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Element');
    graphData.addColumn('number', 'Percentage');
    $.each(pData, function(key, val) {
        graphData.addRow([key, val]);
    })
    var chart = new google.visualization.PieChart($("#myChart")[0]);
    chart.draw(graphData, options);
}

function drawBar() {
    graphData = new google.visualization.DataTable();
    var data = google.visualization.arrayToDataTable(bData);
    var chart = new google.charts.Bar($("#myChart")[0]);
    var options = {
        'title': "Bar Chart",
        'width': 700,
        'height': 300
    };
    chart.draw(data, options);
}

$(document).ready(function() {

    $.get('/OverallData', null, function(rdata) {
        data = rdata;
        var pie = {};
        var pieData = JSON.parse(data.pieChartData);
        for (var a of pieData) {
            if (a.type === null)
                pie["anonymous"] = a.count;
            else
                pie[a.type] = a.count
        }
        pData = pie;
        drawPie();

        barDict = {};
        bData = JSON.parse(data.barChartData);
        for (var a of bData) {
            if (barDict[a.year] === undefined) {
                barDict[a.year] = [a.year, 0, 0, 0, 0];
                switch (a.type) {
                    case "admin":
                        barDict[a.year][1] += a.count;
                        break;
                    case "bot":
                        barDict[a.year][3] += a.count;
                        break;
                    case "regular":
                        barDict[a.year][4] += a.count;
                        break;
                    default:
                        barDict[a.year][2] += a.count;
                }
            } else {
                switch (a.type) {
                    case "admin":
                        barDict[a.year][1] += a.count;
                        break;
                    case "bot":
                        barDict[a.year][3] += a.count;
                        break;
                    case "regular":
                        barDict[a.year][4] += a.count;
                        break;
                    default:
                        barDict[a.year][2] += a.count;
                }
            }
        }

        bData = [];
        var index = 0;
        for (var key in barDict) {
            barDict[key].splice(0, 1);
            bData[index] = [key].concat(barDict[key]);
            index++;

        }
        var content = ['year', 'Administrator', 'Anonymous', 'Bot', 'Regular User'];
        bData.splice(0, 0, content);
    });

    $("#pie").on('click', function(event) {
        event.preventDefault();
        drawPie();
    })

    $("#bar").on('click', function(event) {
        event.preventDefault();
        drawBar();
    })

});