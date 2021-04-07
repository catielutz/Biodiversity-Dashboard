// create function for dropdown menu change
function optionChanged(selection) {
    console.log(selection);
    // read in json file
    d3.json("../../data/samples.json").then((data)=> {
        console.log(data);
        // clear dropdown
        d3.select("#selDataset").html("");

    data.metadata.forEach(subject => {
        d3.select("#selDataset").append("option").attr("value", subject.id).text(subject.id);
        });
    d3.select("#selDataset").node().value = selection;

    var metaDataID = data.metadata.filter(subject => (subject.id == selection));
    //        {
    //       console.log("------------------------")
    //       console.log(subject);
    //       console.log(subject.id);
          
    //    };

    console.log(metaDataID);

    // demographic panel 

    var demoPanel = d3.select("#sample-metadata");
    demoPanel.html("")
    Object.entries(metaDataID[0]).forEach(subject => {
        demoPanel.append("p").text(`${subject[0]}: ${subject[1]}`)
    });

    // bar chart

    var sampleID = data.samples.filter(sub => parseInt(sub.id) == selection);
    var sampleValue = sampleID[0].sample_values.slice(0,10);
    sampleValue= sampleValue.reverse();
    var otuID = sampleID[0].otu_ids.slice(0,10);
    otuID = otuID.reverse();
    var otuLabels = sampleID[0].otu_labels
    otuLabels = otuLabels.reverse();

    var trace = {
        y: otuID.map(sub => "OTU" + " " + sub),
        x: sampleValue,
        type: "bar",
        orientation: "h",
        text: otuLabels
    }
    var layout = {
        title: "<b>Top 10 OTUs found in Individual Subject</b>",
        xaxis: {title: "<i>Number of Samples Collected</i>"},
        yaxis: {title: "<i>OTU ID</i>"}
    }
    Plotly.newPlot("bar", [trace], layout);

    // bubble chart

    var bubbleOTU = sampleID[0].otu_ids;
    var bubbleVal = sampleID[0].sample_values;
    
    var trace1 = {
        x: bubbleOTU,
        y: bubbleVal,
        mode: "markers",
        marker: {
            color: bubbleOTU,
            colorscale: "YlGnBu",
            type: "heatmap",
            size: bubbleVal
        }
    }
    Plotly.newPlot("bubble", [trace1]);

    // attempt at bonus gauge - I did it!!
    var gaugeDiv = d3.select("#gauge");
    gaugeDiv.html("");
    var washFrequency = metaDataID[0].wfreq;

    var gaugeData = [
        {
        domain: { x: [0, 1], y: [0, 1] },
		value: washFrequency,
        title: { text: "<b>Belly Button Washing Frequency</b><br> Scrubs/Week" },
        type: "indicator",
		mode: "gauge+number",
        gauge: {
            axis: { range: [0,9] },
            bar: { color: "#d2dbf4" },
            steps: [
               { range: [0, 1], color: "#d9fbfd" },
               { range: [1, 2], color: "#c9fae8" },
               { range: [2, 3], color: "#b4e9d7" },
               { range: [3, 4], color: "#7fcdbb" },
               { range: [4, 5], color: "#41b6c4" },
               { range: [5, 6], color: "#1d91c0" },
               { range: [6, 7], color: "#225ea8" },
               { range: [7, 8], color: "#01579B" },
               { range: [8, 9], color: "#0c2c84"}
            ],
            threshold: {
               value: washFrequency
             }
           }
         }
       ]; 
    Plotly.newPlot("gauge", gaugeData);

    })
};

optionChanged(940);

d3.select("#selDataset").on('change',() => {
    optionChanged(d3.event.target.value);
    
    })