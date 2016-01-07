(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['add-word'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"add-word-page\">\n  <h1>Add A Word</h1>\n  <hr>\n  <form method=\"POST\">\n    <input name=\"word\" placeholder=\"Person, Place, Thing, etc.\" autofocus>\n    <button type=\"submit\">"
    + this.escapeExpression((helpers.subtract || (depth0 && depth0.subtract) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.wordsPerPlayer : stack1),((stack1 = ((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.words : stack1)) != null ? stack1.length : stack1),{"name":"subtract","hash":{},"data":data}))
    + " remaining</button>\n  </form>\n</div>\n";
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
templates['game/current_player'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "  <div class=\"current-word\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentWord : stack1), depth0))
    + "</div>\n  <a class=\"button correct\">Correct</a>\n  <a class=\"button skip\">Skip</a>\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <a class=\"button start-round\">Ready</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.phase : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h1>\n<p class=\"phase-instructions\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.phase : depth0)) != null ? stack1.instructions : stack1), depth0))
    + "</p>\n\n"
    + ((stack1 = this.invokePartial(partials['game/timer'],depth0,{"name":"game/timer","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.roundStarted : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['game/debug_panel'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "<div class=\"debug\">\n  <h3>Debug Info</h3>\n  <h4>game =</h4>\n  <pre>"
    + alias2((helpers.json || (depth0 && depth0.json) || alias1).call(depth0,(depth0 != null ? depth0.game : depth0),true,{"name":"json","hash":{},"data":data}))
    + "</pre>\n  <h4>phase =</h4>\n  <pre>"
    + alias2((helpers.json || (depth0 && depth0.json) || alias1).call(depth0,(depth0 != null ? depth0.phase : depth0),true,{"name":"json","hash":{},"data":data}))
    + "</pre>\n  <h4>teams =</h4>\n  <pre>"
    + alias2((helpers.json || (depth0 && depth0.json) || alias1).call(depth0,(depth0 != null ? depth0.teams : depth0),true,{"name":"json","hash":{},"data":data}))
    + "</pre>\n  <h4>currentPlayer =</h4>\n  <pre>"
    + alias2((helpers.json || (depth0 && depth0.json) || alias1).call(depth0,(depth0 != null ? depth0.currentPlayer : depth0),true,{"name":"json","hash":{},"data":data}))
    + "</pre>\n</div>";
},"useData":true});
templates['game/guessing_player'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<h1>Guess</h1>\n"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentPlayer : stack1)) != null ? stack1.name : stack1), depth0))
    + " is up.\n<div>"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.wordsInBowl : stack1)) != null ? stack1.length : stack1), depth0))
    + " words in bowl.</div>\n"
    + ((stack1 = this.invokePartial(partials['game/timer'],depth0,{"name":"game/timer","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['game/join_teams'] = template({"1":function(depth0,helpers,partials,data) {
    return " disabled";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<h1>Join Teams</h1>\n"
    + ((stack1 = this.invokePartial(partials['game/team_list'],depth0,{"name":"game/team_list","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "\n<a id=\"start-game-button\" class=\"button"
    + ((stack1 = helpers['if'].call(depth0,(helpers.not || (depth0 && depth0.not) || alias1).call(depth0,(helpers.readyToStart || (depth0 && depth0.readyToStart) || alias1).call(depth0,(depth0 != null ? depth0.game : depth0),{"name":"readyToStart","hash":{},"data":data}),{"name":"not","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">Start Game</a>";
},"usePartial":true,"useData":true});
templates['game/main'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = this.invokePartial(partials['game/scores'],depth0,{"name":"game/scores","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(helpers.not || (depth0 && depth0.not) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.gameStarted : stack1),{"name":"not","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = this.invokePartial(partials['game/join_teams'],depth0,{"name":"game/join_teams","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  ";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.equal || (depth0 && depth0.equal) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.id : stack1),((stack1 = (depth0 != null ? depth0.currentPlayer : depth0)) != null ? stack1.id : stack1),{"name":"equal","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "  ";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = this.invokePartial(partials['game/current_player'],depth0,{"name":"game/current_player","data":data,"indent":"      ","helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(helpers.equal || (depth0 && depth0.equal) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.currentTeam : stack1),((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.team : stack1),{"name":"equal","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = this.invokePartial(partials['game/guessing_player'],depth0,{"name":"game/guessing_player","data":data,"indent":"      ","helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"12":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = this.invokePartial(partials['game/waiting_player'],depth0,{"name":"game/waiting_player","data":data,"indent":"      ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"game-page\">\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.gameEnded : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"usePartial":true,"useData":true});
templates['game/scores'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<h1>Game Over</h1>\n"
    + ((stack1 = this.invokePartial(partials['game/team_list'],depth0,{"name":"game/team_list","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "<a href=\""
    + this.escapeExpression((helpers.getUrl || (depth0 && depth0.getUrl) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.game : depth0),"delete",{"name":"getUrl","hash":{},"data":data}))
    + "\">Delete Game</a>";
},"usePartial":true,"useData":true});
templates['game/team_list'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <div\n        class=\"team\n          "
    + ((stack1 = helpers['if'].call(depth0,(helpers.and || (depth0 && depth0.and) || alias1).call(depth0,(helpers.not || (depth0 && depth0.not) || alias1).call(depth0,((stack1 = ((stack1 = (data && data.root)) && stack1.game)) && stack1.gameEnded),{"name":"not","hash":{},"data":data}),(helpers.equal || (depth0 && depth0.equal) || alias1).call(depth0,(depth0 != null ? depth0.index : depth0),((stack1 = ((stack1 = (data && data.root)) && stack1.game)) && stack1.currentTeam),{"name":"equal","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n          "
    + ((stack1 = helpers['if'].call(depth0,(helpers.not || (depth0 && depth0.not) || alias1).call(depth0,((stack1 = ((stack1 = (data && data.root)) && stack1.game)) && stack1.gameStarted),{"name":"not","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"\n        data-team-id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n      <h1>\n        <div class=\"name\">\n          "
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n        </div>\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (data && data.root)) && stack1.game)) && stack1.gameStarted),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      </h1>\n      <ol>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.players : depth0),{"name":"each","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      </ol>\n    </div>\n";
},"2":function(depth0,helpers,partials,data) {
    return "current";
},"4":function(depth0,helpers,partials,data) {
    return "joinable";
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return "          <div class=\"points\">\n            "
    + this.escapeExpression(((helper = (helper = helpers.points || (depth0 != null ? depth0.points : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"points","hash":{},"data":data}) : helper)))
    + " points\n          </div>\n";
},"8":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "          <li class=\""
    + ((stack1 = helpers['if'].call(depth0,(helpers.and || (depth0 && depth0.and) || alias1).call(depth0,(helpers.not || (depth0 && depth0.not) || alias1).call(depth0,((stack1 = ((stack1 = (data && data.root)) && stack1.game)) && stack1.gameEnded),{"name":"not","hash":{},"data":data}),(helpers.equal || (depth0 && depth0.equal) || alias1).call(depth0,(depth0 != null ? depth0.id : depth0),((stack1 = ((stack1 = (data && data.root)) && stack1.currentPlayer)) && stack1.id),{"name":"equal","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers['if'].call(depth0,(helpers.lessThan || (depth0 && depth0.lessThan) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.words : depth0)) != null ? stack1.length : stack1),((stack1 = ((stack1 = (data && data.root)) && stack1.game)) && stack1.wordsPerPlayer),{"name":"lessThan","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"\n              data-player-id=\""
    + alias2(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n            "
    + alias2(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + ((stack1 = helpers['if'].call(depth0,(helpers.equal || (depth0 && depth0.equal) || alias1).call(depth0,(depth0 != null ? depth0.id : depth0),((stack1 = ((stack1 = (data && data.root)) && stack1.player)) && stack1.id),{"name":"equal","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n          </li>\n";
},"9":function(depth0,helpers,partials,data) {
    return "waiting";
},"11":function(depth0,helpers,partials,data) {
    return " (you)";
},"13":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"team joinable new-team\" data-team-id=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.teams : depth0)) != null ? stack1.length : stack1), depth0))
    + "\">\n      <h1>Create New Team...</h1>\n    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"team-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.teams : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.not || (depth0 && depth0.not) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.gameStarted : stack1),{"name":"not","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
templates['game/timer'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=helpers.helperMissing;

  return "  <div id=\"timer\">"
    + this.escapeExpression((helpers.formatClock || (depth0 && depth0.formatClock) || alias1).call(depth0,(helpers.timeRemaining || (depth0 && depth0.timeRemaining) || alias1).call(depth0,(depth0 != null ? depth0.game : depth0),{"name":"timeRemaining","hash":{},"data":data}),{"name":"formatClock","hash":{},"data":data}))
    + "</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.roundStarted : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['game/waiting_player'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<h1>Wait...</h1>\n<div>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.wordsInBowl : stack1)) != null ? stack1.length : stack1), depth0))
    + " words in bowl.</div>\n"
    + ((stack1 = this.invokePartial(partials['game/timer'],depth0,{"name":"game/timer","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + ((stack1 = this.invokePartial(partials['game/team_list'],depth0,{"name":"game/team_list","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['how-to-play'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"how-to-play-page\">\n  <h1>How to Play SaladBowl</h1>\n\n  <p>\n    SaladBowl is based off of a popular party game that goes by many names including Salad Bowl, Bowl of Nouns, Nouns\n    and Proper Nouns, and The Nouns Game.\n  </p>\n\n  <p>\n    To play, you will need a group of at least 4 people, though larger groups are preferable.\n    Everyone will need an internet-enabled device to play.\n    On the main page, start a new game and give it a name.\n  </p>\n\n  <p>\n    Now everyone needs to join this game. You can either send them the url of the game, or they can find a link on the\n    homepage.\n  </p>\n\n  <p>\n    When you have joined a game, first enter your name.\n    After this you will be asked to submit 5 (or some other number) nouns to the \"bowl\".\n    Try to be creative.\n  </p>\n\n  <p>\n    Once you have entered your words, you will need to join a team.\n    Join a team by clicking/tapping on it.\n    When everyone is satisfied with the teams, press the \"Start Game\" button.\n  </p>\n\n  <p>\n    The game will have 3 rounds.\n    During a round, teams will alternate taking 60 second turns until the round is over.\n    On a team's turn, one person will be the reader.\n    The reader will randomly receive one noun at a time.\n    The rest of the team will attempt to guess the noun the reader has.\n    When a teammate guesses correctly, the reader presses the \"CORRECT\" button, and their team receives one point.\n    If the reader doesn't like a noun, they can press the \"SKIP\" button to draw a new noun.\n    There is no penalty for skipping.\n  </p>\n\n  <p>\n    During each round, the restrictions imposed on the reader vary.\n    In the first round, the reader is allowed to speak any words that are not contained in the noun they are reading.\n    No gestures are allowed.\n    In the second round, the reader is not allowed to make any noise and must instead use actions to convey their\n    message.\n    In the final round the reader is only allowed to say one word per noun.\n    Like in the first round, no gestures are allowed.\n  </p>\n\n  <p>\n    When all the nouns have been correctly guessed and the \"bowl\" is empty, the round is over.\n    The words go back into the \"bowl\" and the next round begins.\n  </p>\n\n  <p>\n    The team with the most points after all three rounds is the winner.\n  </p>\n\n  <p></p>\n  <hr>\n  <a class=\"button\" href=\"/\">Back</a>\n</div>\n\n";
},"useData":true});
templates['index'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"recent-games\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.games : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n";
},"2":function(depth0,helpers,partials,data) {
    var alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "        <div>\n          <a href=\""
    + alias2((helpers.getUrl || (depth0 && depth0.getUrl) || alias1).call(depth0,depth0,{"name":"getUrl","hash":{},"data":data}))
    + "\">"
    + alias2((helpers.or || (depth0 && depth0.or) || alias1).call(depth0,(depth0 != null ? depth0.name : depth0),(depth0 != null ? depth0._id : depth0),{"name":"or","hash":{},"data":data}))
    + "</a>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"index-page\">\n  <h1>Welcome to SaladBowl</h1>\n  <hr>\n  <a class=\"button\" href=\"/new-game\">New Game</a>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.games : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n";
},"useData":true});
templates['join'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div id=\"join-page\">\n  <h1>Joining Game &ndash; "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h1>\n  <h4>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1._id : stack1), depth0))
    + "</h4>\n  <hr>\n  <form method=\"POST\">\n    <input autofocus name=\"playerName\" placeholder=\"Enter your name\" value=\""
    + alias2(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"username","hash":{},"data":data}) : helper)))
    + "\">\n    <button type=\"submit\">Join Game</button>\n    <a class=\"button\" href=\"/\">Back</a>\n  </form>\n</div>\n";
},"useData":true});
templates['layout'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "<!DOCTYPE html>\n<html>\n<head>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\"/>\n\n  <title>"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</title>\n  <link rel=\"stylesheet\" href=\"/css/main.css\"/>\n  <script src=\"/vendor/socket.io-client/socket.io.js\"></script>\n  <script src=\"/vendor/handlebars/handlebars.runtime.js\"></script>\n  <script src=\"/vendor/jquery/dist/jquery.js\"></script>\n  <script src=\"/js/main.js\"></script>\n\n  <script>\n    SALADBOWL = {};\n    SALADBOWL.game = "
    + ((stack1 = (helpers.jsObject || (depth0 && depth0.jsObject) || alias1).call(depth0,(depth0 != null ? depth0.game : depth0),{"name":"jsObject","hash":{},"data":data})) != null ? stack1 : "")
    + ";\n    SALADBOWL.player = "
    + ((stack1 = (helpers.jsObject || (depth0 && depth0.jsObject) || alias1).call(depth0,(depth0 != null ? depth0.player : depth0),{"name":"jsObject","hash":{},"data":data})) != null ? stack1 : "")
    + ";\n    SALADBOWL.currentPlayer = "
    + ((stack1 = (helpers.jsObject || (depth0 && depth0.jsObject) || alias1).call(depth0,(depth0 != null ? depth0.currentPlayer : depth0),{"name":"jsObject","hash":{},"data":data})) != null ? stack1 : "")
    + ";\n    SALADBOWL.serverTime = "
    + ((stack1 = (helpers.jsObject || (depth0 && depth0.jsObject) || alias1).call(depth0,(depth0 != null ? depth0.serverTime : depth0),{"name":"jsObject","hash":{},"data":data})) != null ? stack1 : "")
    + ";\n  </script>\n</head>\n<body>\n<main>\n  <div id=\"main-content\">\n    "
    + ((stack1 = ((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"body","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n  </div>\n  <hr>\n  <footer>\n    <a href=\"/\">Home</a>\n    <a href=\"/how-to-play\">How To Play</a>\n\n    <div>\n      <a href=\"https://github.com/simonbw/saladbowl-js\">https://github.com/simonbw/saladbowl-js</a>\n    </div>\n  </footer>\n</main>\n</body>\n</html>";
},"useData":true});
templates['new-game'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"new-game-page\">\n  <h1>New Game</h1>\n  <hr>\n  <form method=\"POST\">\n    <label>\n      Name of game\n      <input name=\"gameName\" placeholder=\"Name your game\" autofocus>\n    </label>\n\n    <label>\n      Words Per Player\n      <input name=\"wordsPerPlayer\" value=\"5\" type=\"number\" min=\"1\" max=\"99\">\n    </label>\n\n    <div class=\"button-row\">\n      <button type=\"submit\">Create</button>\n      <a class=\"button\" href=\"/\">Back</a>\n    </div>\n  </form>\n</div>\n";
},"useData":true});
})();