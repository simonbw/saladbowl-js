(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['add-word'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h1>Add A Word</h1>\n\n<form method=\"POST\">\n  <input name=\"word\" autofocus>\n  <button type=\"submit\">Submit</button>\n</form>";
},"useData":true});
templates['error'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression, alias2=this.lambda;

  return "<h1>"
    + alias1(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{},"data":data}) : helper)))
    + "</h1>\n<h2>"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.error : depth0)) != null ? stack1.status : stack1), depth0))
    + "</h2>\n<pre>"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.error : depth0)) != null ? stack1.stack : stack1), depth0))
    + "</pre>\n";
},"useData":true});
templates['game'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "  Current Word: "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentWord : stack1), depth0))
    + "\n";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "    <div class=\"team\">\n      <div class=\"team-name\">\n        Team "
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\n        ("
    + alias2((helpers.get || (depth0 && depth0.get) || alias1).call(depth0,(depths[1] != null ? depths[1].points : depths[1]),(data && data.index),{"name":"get","hash":{},"data":data}))
    + " points)\n        "
    + ((stack1 = helpers['if'].call(depth0,(helpers.and || (depth0 && depth0.and) || alias1).call(depth0,(helpers.equal || (depth0 && depth0.equal) || alias1).call(depth0,(data && data.index),((stack1 = (depths[1] != null ? depths[1].game : depths[1])) != null ? stack1.currentTeam : stack1),{"name":"equal","hash":{},"data":data}),(helpers.greaterThan || (depth0 && depth0.greaterThan) || alias1).call(depth0,((stack1 = (depths[1] != null ? depths[1].game : depths[1])) != null ? stack1.currentPhase : stack1),0,{"name":"greaterThan","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n      </div>\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.equal || (depth0 && depth0.equal) || alias1).call(depth0,((stack1 = (depths[1] != null ? depths[1].game : depths[1])) != null ? stack1.currentPhase : stack1),0,{"name":"equal","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      <ol>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      </ol>\n    </div>\n";
},"4":function(depth0,helpers,partials,data) {
    return "(Current Team)";
},"6":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression;

  return "        <form action=\"/game/"
    + alias1(this.lambda(((stack1 = (depths[2] != null ? depths[2].game : depths[2])) != null ? stack1._id : stack1), depth0))
    + "/join-team\" method=\"POST\">\n          <input type=\"hidden\" name=\"team\" value=\""
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n          <button type=\"submit\">Join</button>\n        </form>\n";
},"8":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "          <li>\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.equal || (depth0 && depth0.equal) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.id : depth0),((stack1 = (depths[1] != null ? depths[1].currentPlayer : depths[1])) != null ? stack1.id : stack1),{"name":"equal","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(9, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            "
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + " ("
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + ")\n          </li>\n";
},"9":function(depth0,helpers,partials,data) {
    return "              >>>\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression;

  return "    <div class=\"team new-team\">\n      New Team\n      <form action=\"/game/"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1._id : stack1), depth0))
    + "/join-team\" method=\"POST\">\n        <input type=\"hidden\" name=\"team\" value=\""
    + alias1((helpers.length || (depth0 && depth0.length) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.teams : depth0),{"name":"length","hash":{},"data":data}))
    + "\">\n        <button type=\"submit\">Join</button>\n      </form>\n    </div>\n";
},"13":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <a href=\"/game/"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1._id : stack1), depth0))
    + "/next-team\">Next Team </a>\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression;

  return "    <a href=\"/game/"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1._id : stack1), depth0))
    + "/next-phase\">Next Phase ("
    + alias1((helpers.sum || (depth0 && depth0.sum) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentPhase : stack1),1,{"name":"sum","hash":{},"data":data}))
    + ")</a>\n";
},"17":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "    <a href=\"/game/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1._id : stack1), depth0))
    + "/correct-word\">CORRECT</a>\n    <a href=\"/game/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1._id : stack1), depth0))
    + "/skip-word\">SKIP</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "<meta http-equiv=\"refresh\" content=\"2\">\n\n<h1>SaladBowl</h1>\n<h2>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.phase : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h2>\n<p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.phase : depth0)) != null ? stack1.instructions : stack1), depth0))
    + "</p>\n\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.equal || (depth0 && depth0.equal) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.id : stack1),((stack1 = (depth0 != null ? depth0.currentPlayer : depth0)) != null ? stack1.id : stack1),{"name":"equal","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n<ul id=\"team-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.teams : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.equal || (depth0 && depth0.equal) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentPhase : stack1),0,{"name":"equal","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(11, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n\n<div class=\"action-list\">\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.greaterThan || (depth0 && depth0.greaterThan) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentPhase : stack1),0,{"name":"greaterThan","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(13, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(helpers.lessThan || (depth0 && depth0.lessThan) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentPhase : stack1),(helpers.length || (depth0 && depth0.length) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.phases : stack1),{"name":"length","hash":{},"data":data}),{"name":"lessThan","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(15, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(helpers.greaterThan || (depth0 && depth0.greaterThan) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentPhase : stack1),0,{"name":"greaterThan","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(17, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  <a href=\"/game/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1._id : stack1), depth0))
    + "/delete\">Delete Game</a>\n</div>\n\n\n<div class=\"debug\">\n  Debug Info\n  <pre>"
    + alias2((helpers.json || (depth0 && depth0.json) || alias3).call(depth0,(depth0 != null ? depth0.game : depth0),true,{"name":"json","hash":{},"data":data}))
    + "</pre>\n</div>\n";
},"useData":true,"useDepths":true});
templates['index'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "    <div>\n      <a href=\"/game/"
    + alias2(alias1((depth0 != null ? depth0._id : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0._id : depth0), depth0))
    + "</a>\n    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<h1>Salad Bowl</h1>\n<p>Welcome "
    + this.escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"user","hash":{},"data":data}) : helper)))
    + "</p>\n\n<div>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.games : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<a href=\"/new-game\">New Game</a>";
},"useData":true});
templates['join'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h1>Add Player</h1>\n\n<form method=\"POST\">\n  <label>\n    Your Name:\n    <input autofocus name=\"playerName\">\n  </label>\n  <button type=\"submit\">Join Game</button>\n</form>";
},"useData":true});
templates['layout'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<!DOCTYPE html>\n<html>\n<head>\n  <title>"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</title>\n  <link rel=\"stylesheet\" href=\"/css/main.css\"/>\n  <script src=\"/vendor/socket.io-client/socket.io.js\"></script>\n  <script src=\"/vendor/handlebars/handlebars.runtime.js\"></script>\n  <script src=\"/vendor/jquery/dist/jquery.js\"></script>\n  <script src=\"/js/main.js\"></script>\n</head>\n<body>\n<main>\n  <div>\n    <a href=\"/\">Home</a>\n    <b>User ID:</b> "
    + alias3(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"user","hash":{},"data":data}) : helper)))
    + "\n  </div>\n  "
    + ((stack1 = ((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"body","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n</main>\n</body>\n</html>";
},"useData":true});
})();