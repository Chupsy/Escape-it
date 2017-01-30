MyApp
    .service('trapsService', function () {
      var trapGroup;
      var deathGroup;
      
      var generateGroup = function(game){

      };
      var addTrapToGame = function(orientation, game, x,y){
      };


        return {
          generateGroup : generateGroup,
          addTrapToGame : addTrapToGame,
          traps : function(){
            return trapGroup;
          },
          death : function(){
            return trapGroup;
          }
        }

    });