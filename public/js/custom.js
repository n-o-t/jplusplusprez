$("h3[data-toggle=popover]")
	.popover({
    	trigger		: 'hover',
    	placement 	: 'top',
    	container 	: 'body'
  	})
    .click(function(e) {
    	e.preventDefault()
    })