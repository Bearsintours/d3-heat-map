localStorage.getItem("global-temperature-data")
  ? renderChart(JSON.parse(localStorage.getItem("global-temperature-data")))
  : d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
      (data) => {
        localStorage.setItem("global-temparature-data", JSON.stringify(data));
        renderChart(data);
      }
    );

function renderChart(data) {
  const dataset = data["monthlyVariance"];
  const padding = 60;
  const height = 500;
  const width = (dataset.length * 3) / 12;
  const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  const svg = d3
    .select("div")
    .append("svg")
    .attr("with", width)
    .attr("height", height)
    .attr("class", "svg");

  const yScale = d3
    .scaleBand()
    .domain(months)
    .range([padding, height - padding]);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);

  const xMin = d3.min(dataset, (d) => d["year"]);
  const xMax = d3.max(dataset, (d) => d["year"]);
  const years = [];
  for (var i = xMin; i <= xMax; i++) {
    if (i % 10 == 0) {
      years.push(i);
    }
  }

  const xScale = d3
    .scaleLinear()
    .domain(years)
    .range([padding, width - padding]);
  const xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  //   const width = dataset.length * 20 + 2 * padding;
  //   const height = 500;
  //   const yMin = d3.min(dataset, (d) => formatTime(d["Time"]) - 10);
  //   const yMax = d3.max(dataset, (d) => formatTime(d["Time"]));
  //   const yScale = d3
  //     .scaleLinear()
  //     .domain([yMin, yMax])
  //     .range([padding, height - padding]);
  //   const xMin = d3.min(dataset, (d) => Number(d["year"]) - 1);
  //   const xMax = d3.max(dataset, (d) => Number(d["year"]));
  //   const xScale = d3
  //     .scaleLinear()
  //     .domain([xMin, Number(xMax) + 1])
  //     .range([padding, width - padding]);
  //   const svg = d3
  //     .select("div")
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .attr("class", "svg");
  //   const tootTip = d3.select("body").append("div").attr("id", "tooltip");
  //   svg
  //     .selectAll("circle")
  //     .data(dataset)
  //     .enter()
  //     .append("circle")
  //     .attr("cx", (d) => xScale(d["year"]))
  //     .attr("cy", (d) => yScale(formatTime(d["Time"])))
  //     .attr("r", (d) => 5)
  //     .attr("stroke", "black")
  //     .attr("stroke-width", 1)
  //     .attr("class", "dot")
  //     .attr("data-xvalue", (d) => d["year"])
  //     .attr("data-yvalue", (d) => formatTime(d["Time"]))
  //     .attr("fill", (d) => (d["Doping"].length > 0 ? "orange" : "#81A4CD"))
  //     .on("mouseover", (d) => {
  //       d3.select("#tooltip")
  //         .style("opacity", 0.8)
  //         .attr("data-year", d["year"])
  //         .text(d["year"] + ": " + d["Name"]);
  //     })
  //     .on("mouseout", () => d3.select("#tooltip").style("opacity", 0))
  //     .on("mousemove", () =>
  //       d3
  //         .select("#tooltip")
  //         .style("left", d3.event.pagex + 20 + "px")
  //         .style("top", d3.event.pagey - 10 + "px")
  //     );
  //   const yAxis = d3
  //     .axisLeft(yScale)
  //     .tickFormat(
  //       (d) => new Date(d).getMinutes() + ":" + addZero(new Date(d).getSeconds())
  //     );
  //   svg
  //     .append("g")
  //     .attr("id", "y-axis")
  //     .attr("transform", "translate(" + padding + ", 0)")
  //     .call(yAxis);
  //   const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  //   svg
  //     .append("g")
  //     .attr("id", "x-axis")
  //     .attr("transform", "translate(0," + (height - padding) + ")")
  //     .call(xAxis);
  //   // Legend
  //   const legend = d3.select("svg").append("svg").attr("id", "legend");
  //   const legendMargin = 10;
  //   const legendData = [
  //     {
  //       text: "Doping allegations",
  //       color: "orange",
  //     },
  //     {
  //       text: "No doping allegations",
  //       color: "#81A4CD",
  //     },
  //   ];
  //   legend
  //     .selectAll("g.legend")
  //     .data(legendData)
  //     .enter()
  //     .append("g")
  //     .attr("transform", function (d, i) {
  //       return "translate(" + 600 + "," + (legendMargin + i * 20) + ")";
  //     })
  //     .each(function (d, i) {
  //       d3.select(this)
  //         .append("rect")
  //         .attr("width", 30)
  //         .attr("height", 15)
  //         .attr("fill", d.color);
  //       d3.select(this)
  //         .append("text")
  //         .attr("text-anchor", "start")
  //         .attr("x", 30 + 10)
  //         .attr("y", 15 / 2)
  //         .attr("dy", "0.35em")
  //         .text(d.text);
  //     });
  // }
  // function formatTime(time) {
  //   const date = new Date();
  //   time = time.split(":");
  //   const min = time[0];
  //   const sec = time[1];
  //   date.setMinutes(min, sec, 0);
  //   return date;
  // }
  // function addZero(i) {
  //   if (i < 10) {
  //     i = "0" + i;
  //   }
  //   return i;
}
