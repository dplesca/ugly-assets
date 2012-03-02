var gh = require('grasshopper'), request = require('request');

gh.configure({
    viewsDir: 'views',
    layout: 'index'
});

function get_uglified_js(text){
	var jsp = require("uglify-js").parser, pro = require("uglify-js").uglify;
	var ast = jsp.parse(text);
	ast = pro.ast_mangle(ast);
	ast = pro.ast_squeeze(ast);
	return pro.gen_code(ast);
}

function get_uglified_css(css){
	var clean = require('clean-css');
	return clean.process(css);
}

gh.get('/', function() {
	this.model['scripts'] = ['/js/uglyjs.js'];
    this.render('js');
});

gh.get('/css', function() {
    this.render('css');
});

gh.post('/js', function (){
	var self = this;
	if (self.params.url !== undefined){
		request( { uri: self.params.url }, function (error, response, body) {
			self.renderText (get_uglified_js(body) );
		});
	}
	else if (self.params.code !== undefined) {
		self.renderText( get_uglified_js(self.params.code) );
	}
	else {
		self.renderText( get_uglified_js(self.params.file_content) );
	}
});

gh.post('/css', function(){
	var self = this;
	if (self.params.url !== undefined){
		request( { uri: self.params.url }, function (error, response, body) {
			self.renderText( get_uglified_css(body) );
		});
	}
});

gh.serve(80);