const apiUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

localStorage.getItem("global-temperature-data")
  ? renderChart(JSON.parse(localStorage.getItem("global-temperature-data")))
  : d3.json(apiUrl, (data) => {
      localStorage.setItem("global-temparature-data", JSON.stringify(data));
      renderChart(data);
    });

function renderChart(data) {
  const dataset = data["monthlyVariance"];
  const baseTemp = data["baseTemperature"];

  const padding = 60;
  const height = 600;
  const width = 1500;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create svg
  const svg = d3.select("#chart").append("svg").attr("with", width).attr("height", height).attr("id", "svg");

  // yAxis
  const yScale = d3
    .scaleBand()
    .domain(months)
    .range([0, height - 100]);
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding - 1}, 5)`)
    .call(yAxis);

  // xAxis
  const xMin = d3.min(dataset, (d) => d["year"]);
  const xMax = d3.max(dataset, (d) => d["year"]);
  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, width - 200]);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSizeOuter(0);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${padding}, ${height - 95})`)
    .call(xAxis.ticks((xMax - xMin) / 10));

  // Heat map
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d["year"]) + padding)
    .attr("y", (d) => yScale(months[d["month"] - 1]))
    .attr("width", 5)
    .attr("height", (height - 100) / 10.8)
    .attr("fill", (d) => mapTemptoColor(d["variance"] + baseTemp))
    .attr("class", "cell")
    .attr("data-year", (d) => d["year"])
    .attr("data-month", (d) => d["month"] - 1)
    .attr("data-temp", (d) => d["variance"] * baseTemp)
    .on("mouseover", (d) => {
      d3.select("#tooltip").style("opacity", 0.8).attr("data-year", d["year"]).text(d["year"]);
    })
    .on("mouseout", () => d3.select("#tooltip").style("opacity", 0))
    .on("mousemove", () =>
      d3
        .select("#tooltip")
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 80 + "px")
    );

  function mapTemptoColor(temp) {
    if (temp < 2.8) {
      return "rgb(49, 54, 149)";
    } else if (temp < 3.9) {
      return "rgb(69, 117, 180)";
    } else if (temp < 5) {
      return "rgb(116, 173, 209)";
    } else if (temp < 6.1) {
      return "rgb(171, 217, 233)";
    } else if (temp < 7.2) {
      return "rgb(224, 243, 248)";
    } else if (temp < 8.3) {
      return "rgb(255, 255, 191)";
    } else if (temp < 9.5) {
      return "rgb(254, 224, 144)";
    } else if (temp < 10.6) {
      return "rgb(253, 174, 97)";
    } else if (temp < 11.7) {
      return "rgb(244, 109, 67)";
    } else if (temp < 12.8) {
      return "rgb(215, 48, 39)";
    } else {
      return "rgb(165, 0, 38)";
    }
  }

  // Tooltip
  d3.select("body").append("div").attr("id", "tooltip");

  // Legend
  const legend = d3.select("#chart").append("svg").attr("id", "legend").attr("with", 1000).attr("height", 50);

  const legendData = [
    {
      text: "< 2.8",
      color: "rgb(49, 54, 149)",
    },
    {
      text: "< 3.9",
      color: "rgb(69, 117, 180)",
    },
    {
      text: "< 5",
      color: "rgb(116, 173, 209)",
    },
    {
      text: "< 6.1",
      color: "rgb(171, 217, 233)",
    },
    {
      text: "< 7.2",
      color: "rgb(224, 243, 248)",
    },
    {
      text: "< 8.3",
      color: "rgb(255, 255, 191)",
    },
    {
      text: "< 9.5",
      color: "rgb(254, 224, 144)",
    },
    {
      text: "< 10.6",
      color: "rgb(253, 174, 97)",
    },
    {
      text: "< 11.7",
      color: "rgb(244, 109, 67)",
    },
    {
      text: "< 12.8",
      color: "rgb(215, 48, 39)",
    },
    {
      text: "> 12.8",
      color: "rgb(165, 0, 38)",
    },
  ];

  legend
    .selectAll("g.legend")
    .data(legendData)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return `translate(${i * 100}, 0)`;
    })
    .each(function (d) {
      d3.select(this)
        .append("rect")
        .attr("width", 30)
        .attr("height", 15)
        .attr("fill", d.color)
        .attr("stroke", "rgb(0,0,0)");
      d3.select(this)
        .append("text")
        .attr("text-anchor", "start")
        .attr("x", 40)
        .attr("y", 15 / 2)
        .attr("dy", "0.35em")
        .text(d.text);
    });
}
