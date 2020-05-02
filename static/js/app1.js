// Build out first chart - Top otu's bar chart
function buildbarchart(sample) {
    // grab data
    d3.json("samples.json").then((data) => {
    // write out the data to see what we have
      console.log(data);  
      var samples = data.samples;
    //   filter the data
      var dataArray = samples.filter(sampleObj => sampleObj.id == sample);
    //   grab first one
      var result = dataArray[0];
    //   write out result
      console.log(result);
      var sample_values = result.sample_values;
    //   write out values
      console.log(sample_values);
    //   grab id's
      var otu_id = result.otu_ids;
    //   write out otu_id's
      console.log(otu_id);
    //   print out "OTU" plus the number
      var combined_labels = otu_id.map(id => `OTU ${id}`)
    //   otu_labels for the hover text
      var hovertext = result.otu_labels;
    //   filter top to bottom, looks like its from least to most going down (ask mark)
      var sorted_values = sample_values.sort((a, b) => b - a);
    //   .reverse()
      var top_samples = sorted_values.slice(0,10).reverse();
    // flip labels with reverse function
      var sorted_combined_labels = combined_labels.sort((a,b) => b - a);
      var top_labels = sorted_combined_labels.slice(0,10).reverse();
    // sample_values as the values for the bar chart, otu_ids as the labels fro the bar chart, otu_labels as the hovertext for the chart
      var barcharttrace = {
        type: "bar",
        x: top_samples,
        y: top_labels,
        orientation: "h",
        text: hovertext
      }
      var barData = [barcharttrace]
    //   **PLOTTING BAR
      Plotly.newPlot("bar", barData);

    // ******* Bubble Chart ********
    //   Use otu_ids for the x values, sample_values for the y values, sample_values fpr the marker size, otu_ids ofr the marker colors, otu_labels for the text values
      var bubblecharttrace = {
        x: otu_id,
        y: sample_values,
        text: hovertext,
        mode: "markers",
        marker: {
          color: otu_id,
          opacity: [1, 0.75, 0.5, 0.25],
          size: sample_values
        }
      };
      var bubbleData = [bubblecharttrace];
    //   layout with x axis title: "OTU ID"
      var bubbleLayout = {
        xaxis: {
          title: {
            text: "OTU ID"
          }
        }
      }
    //   PLOTTING BUBBLE
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
  }
function init() {
    // dropdown text added
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then(function(data) {
        console.log(data)
        // each number in the dropdown
        var datanames = data.names;
        // write out to see what it looks like in case
        console.log(datanames);
        datanames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample)
        });
        // prints out in the text box the correct first datapoint
        var firstdatapoint = datanames[0];
        buildbarchart(firstdatapoint);
        buildstatsbox(firstdatapoint);
        })
    }
    // statsbox that looks like the example: id, ethnicity, gender, age, location, bbtype, wfreq
function buildstatsbox(sample) {
    // pull data per usual
    d3.json("samples.json").then((data) => {
        // grab data
        var metad = data.metadata;
        // filter data
        var dataArray = metad.filter(sampleObj => sampleObj.id == sample);
        // grab first data
        var result = dataArray[0];
        // locate in html file
        var statsbox = d3.select("#sample-metadata");
        // double check that nothing is in there before we add it
        statsbox.html("");
        // key and value pair in the box
        Object.entries(result).forEach(([key, value]) => {
        statsbox.append("h6").text(`${key}: ${value}`);
        });
    });
    }
    // from activity (ask mark)
d3.selectAll("#selDataset").on("change", optionChanged);
// making interactive based on the drop down menu, both charts will move based on this
function optionChanged(interactivedropdown) {
    // search html file #selDataset
    var dropdownpicklist = d3.select("#selDataset");
    var interactivedropdown = dropdownpicklist.property("value");
    buildbarchart(interactivedropdown);
    buildstatsbox(interactivedropdown);
}
init();