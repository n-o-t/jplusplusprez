
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('page', 'page/');
  app.set('data', __dirname + '/data');
  
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function(req, res, next) {
    res.locals.path = req.path;
    next();
  });



  /************************************
   * Views helpers
   ************************************/   
  // Register helpers for use in view's
  app.locals({    
    spotStyle: function(spot) {
      
      var style = [];
      // Add position
      style.push("top:"    + (spot.top  || 0) );
      style.push("left:"   + (spot.left || 0) );
      // Add size
      style.push("width:"  + (spot.width  || "auto") );      
      style.push("height:" + (spot.height || spot.width || "auto") ); // Square by default
      // Add style
      if(spot.style) style.push(spot.style)

      return style.join(";");
    },
    spotClass: function(spot) {
      var klass = [];
      // Spot classes
      if(spot.class) klass.push(spot.class);
      // Should we hide the spot before sliding to the step ?
      if(spot["hidden-first"]) klass.push("hidden-first");
      // Do the spot contain an animation
      if(spot.animation) {
        klass.push("animated");        
        klass.push("do-"+spot.animation);
      }

      return klass.join(" ");
    }    
  });

  // Add context helpers
  app.use(function(req, res, next) {
    // Unable debug mode
    res.locals.debugMode = req.query.hasOwnProperty("debug")
    next();
  });
  
  /************************************
   * Configure router      
   ************************************/   
  // @warning Needs to be after helpers
  app.use(app.router);
  // Load the default route file
  require("./routes")(app);

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
