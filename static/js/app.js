d3.json("../../data/samples.json").then((data)=> {
    // console.log(data);
    var id = data.names;
    // console.log(data.metadata);
    var select = d3.selectAll("#selDataset");
    Object.entries(id).forEach(([i,n]) => {
        select.append("option").text(n);
    })

});

