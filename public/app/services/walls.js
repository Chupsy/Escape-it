MyApp
    .service('wallsService', function () {
        var wallGroup;
        var wallListImgs = [1,3,5,7,9,11,13,15,81,83,85,87,89,91,93,95,161,163,165,167,169,171,173,175];
        var wallId;

        var generateGroup = function(game){
            wallGroup = game.add.group();
            wallGroup.enableBody = true;
            wallId = wallListImgs[Math.floor(Math.random() * (wallListImgs.length-1))];
        };

        var addWallToGame = function(game,x,y){
            var w = game.add.sprite(x, y, 'wall');
            w.frame = wallId;
            wallGroup.add(w);
            w.body.immovable = true;
          return w;
        };


        return {
            generateGroup : generateGroup,
            addWallToGame : addWallToGame,
            walls : function(){
              return wallGroup;
            }
        }

    });