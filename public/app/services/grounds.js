MyApp
  .service('groundsService', function ($interval, $timeout) {
    var groundGroup;
    var groundId;

    var generateGroup = function(game){
      groundGroup = game.add.group();
      groundGroup.enableBody = true;
      groundId = Math.floor(Math.random() * 48);
    };

    var addGroundToGame = function(game,x,y){
      var w = game.add.sprite(x, y, 'ground');
      w.frame = groundId;
      groundGroup.add(w);
      w.body.immovable = true;
      return w;
    };


    return {
      generateGroup : generateGroup,
      addGroundToGame : addGroundToGame,
      ground : function(){
        return groundGroup;
      }
    }

  });