// Dependencies
var path = require('path')
    , fs = require('fs');

// Module variables
var app;

module.exports = function(a){
  app = a;  
  app.get("/:page.html", routePage);
  app.get("/:page/:step/:spot", editSpotPosition);
};


var routePage = function(req, res) {

    // Template file 
    var tplDir = app.get("page")
     , tplName = req.params.page + "." + app.get("view engine")
     , dataDir = app.get("data")
    , dataName = req.params.page + ".json";

    // Template file path
    var  tpl = path.join(app.get("views"), tplDir, tplName );
    // Data file path
    var data = path.join(dataDir, dataName);

    // Do the template exist ?
    if(! fs.existsSync(tpl)  ) return res.send(404, "Template file not found.");
    // Do the data file exist ?
    if(! fs.existsSync(data)  ) return res.send(404, "Data file not found.");
    
    // Render the page template
    res.render(path.join(tplDir, req.params.page), { data: require(data), page: req.params.page });        
};


var editSpotPosition = function(req, res) {

    var step = req.params.step,
        spot = req.params.spot; 

    // Do we received the position ?
    if(!req.query.top || !req.query.left) return res.send(500);

    var dataDir = app.get("data")
     , dataName = req.params.page + ".json"
     , dataPath = path.join(dataDir, dataName)
         , data = require( dataPath );

    // Does the spot exist ?
    if(!data || !data[step] || !data[step].spots[spot]) return res.send(404);

    // Edit the data
    data[step].spots[spot].top  = req.query.top;
    data[step].spots[spot].left = req.query.left;
    
    var dataString = JSON.stringify(data, null, 4);
    // Mades it persistent
    fs.writeFile(dataPath, dataString);

    // Send the resut now
    res.send(200);
};