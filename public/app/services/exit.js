MyApp
  .service('exitService', function () {
    var exitGroup;

    var generateGroup = function(game){
      exitGroup = game.add.group();
      exitGroup.enableBody = true;
    };

    var addExitToGame = function(game,x,y){
      exitGroup.create(x, y, 'arrow');
      game.add.sprite(x, y, 'arrowSprite');
    };


    return {
      generateGroup : generateGroup,
      addExitToGame : addExitToGame,
      exit : function(){
        return exitGroup;
      }
    }

  });