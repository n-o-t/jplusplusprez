
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')

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

  app.use(require('connect-assets')({
    src: __dirname+'/public'    
  }));

  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function(req, res, next) {
    res.locals.path = req.path;
    next();
  });

app.use(express.basicAuth('jplusplus', 'WX2g5h'));

  /************************************
   * Views helpers
   ************************************/   
  // Register helpers for use in view's
  app.locals({    
    stepStyle: function(step) {
      var style = [];
      // Add style
      if(step.style) style.push(step.style)

      return style.join(";");
    },
    spotStyle: function(spot) {

      var toPx = function(val) {
        return isNaN(val) ? val : val + "px";
      };
      
      var style = [];
      // Add position
      style.push("top:"  + toPx(spot.top  || 0) );
      style.push("left:" + toPx(spot.left || 0) );

      // Add size
      style.push("width:"  + toPx(spot.width) );      
      style.push("height:" + toPx(spot.height || spot.width) ); // Square by default      
      
      // Add style
      if(spot.style) style.push(spot.style)

      return style.join(";");
    },
    spotWrapperStyle: function(spot) {

      var style = [];
      // Add background
      if(spot.background) {
        style.push("background-image: url(" + spot.background + ")");        
      }
      // Add style
      if(spot.wrapperStyle) style.push(spot.wrapperStyle)

      return style.join(";");
    },
    spotClass: function(spot) {
      var klass = [];
      // Spot classes
      if(spot.class) klass.push(spot.class);
      return klass.join(" ");
    },
    strip_tags: function(input, allowed) {
      // http://kevin.vanzonneveld.net
      allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
      var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
      return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
      });
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
