MyApp
    .service('itemsService', function () {
      var itemGroup;
      
      var generateGroup = function(game){
        itemGroup = game.add.group();
        itemGroup.enableBody = true;
      };
      var addItemToGame = function(item,game, x,y){
        var b = game.add.sprite(x,y, 'items');
        itemGroup.add(b);
        b.body.immovable = true;
        b.scale.setTo(1.3,1.3);
        b.item = new item();
        b.frame = b.item.frame;

      };


        return {
          generateGroup : generateGroup,
          addItemToGame : addItemToGame,
          items : function(){
            return itemGroup;
          }
        }

    });