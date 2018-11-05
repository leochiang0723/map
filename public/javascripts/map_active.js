var m_width = $("#map").width(),
    width = 1690,
    height = 800,
    centered;

var projection = d3.geo.mercator()
    .center([104, 36])
    .scale(850)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



d3.json("json/china_countries_topo.json", function(error, us) {
    g.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.china_countries_min).features)
        .enter().append("path")
        .attr("d", path)
        .on("click", function() {
            window.location.href = 'http://localhost:3000/info?area=' + d.properties.name;
        });
});
d3.json("json/china_states_topo.json", function(error, us) {
    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states_min).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "province")
        .on("click", function(d) {
            window.location.href = 'http://localhost:3000/info?area=' + d.properties.name;
        })
        .on("mouseover", function(d) {
            var tmp = document.getElementById(d.properties.name);
            var in_tmp = "";
            if (tmp)
                in_tmp = "當前筆數 : " + tmp.value;
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.properties.name + "<br>" + in_tmp)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});
var num = 0;

function clicked(d) {
    console.log(d);
    var x, y, k;

    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
        $("#ex").on("show.bs.modal", function(e) {
            var modal = $(this)
            modal.find('.modal-title').text(d.properties.name)
                //    modal.find('.modal-body').text(d.properties.name)

        });
        document.all.map.disabled = false;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
        document.all.map.disabled = true;

    }
    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });



    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}