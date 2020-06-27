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
  const baseTemp = data["baseTemperature"];

  const padding = 60;
  const height = 600;
  const width = 1500;

  const svg = d3
    .select("div")
    .append("svg")
    .attr("with", width)
    .attr("height", height)
    .attr("id", "svg");

  const yScale = d3
    .scaleTime()
    .domain([new Date().setMonth(0), new Date().setMonth(11)])
    .range([0, height - 100]);

  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(
      Array(12)
        .fill(0)
        .map((val, index) => new Date().setMonth(index))
    )
    .tickFormat(d3.timeFormat("%B"));

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding - 1}, 20)`)
    .call(yAxis);

  const xMin = d3.min(dataset, (d) => d["year"]);
  const xMax = d3.max(dataset, (d) => d["year"]);
  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, width - 200]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${padding}, ${height - 50})`)
    .call(xAxis.ticks((xMax - xMin) / 10));

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d["year"]) + padding)
    .attr("y", (d) => yScale(new Date().setMonth(d["month"] - 1)))
    .attr("width", 5)
    .attr("height", height / 12)
    .attr("fill", (d) => mapTemptoColor(d["variance"]))
    .attr("class", "cell")
    .attr("data-year", (d) => d["year"])
    .attr("data-month", (d) => d["month"] - 1)
    .attr("data-temp", (d) => d["variance"] * baseTemp)
    .on("mouseover", function (d) {
      d3.select("#tooltip")
        .style("opacity", 0.8)
        .attr("data-year", d["year"])
        .text(d["year"]);
    })
    .on("mouseout", () => d3.select("#tooltip").style("opacity", 0))
    .on("mousemove", () =>
      d3
        .select("#tooltip")
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 80 + "px")
    );

  function mapTemptoColor(variance) {
    if (variance < -1) {
      return "#3366cc";
    } else if (variance < 0) {
      return "#99ccff";
    } else if (variance < 1) {
      return "#ffffcc";
    } else if (variance < 2) {
      return "#ff9933";
    } else {
      return "#cc3300";
    }
  }

  // Tooltip
  const tootTip = d3.select("body").append("div").attr("id", "tooltip");

  // Legend
  const legend = d3.select("svg").append("svg").attr("id", "legend");
  const legendMargin = 10;
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
}
