MyApp
    .service('phaserService', function (mazeService,itemService,itemsService,playerService, wallsService,groundsService, exitService, trapsService) {

        var game = new Phaser.Game(1440, 832, Phaser.AUTO, '', { preload: preload, create: create, update: update });

        function preload() {
            game.load.spritesheet('wall', 'assets/walls.png', 32, 32);
            game.load.spritesheet('ground', 'assets/ground.png', 32, 32);
            game.load.spritesheet('character', 'assets/characters.png', 32, 32);
            game.load.spritesheet('items', 'assets/items.png', 24, 24);
            game.load.spritesheet('arrowSprite', 'assets/arrow.png', 32, 32);
            game.load.spritesheet('explosion', 'assets/explosion.png', 192, 192);
            game.load.image('arrow', 'assets/arrow.png');
        }
        var player = new playerService.Player(150);

        var map, generatedMap;
        var keyboard = {};

        function create() {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            generateMap();
          keyboard.cursors = game.input.keyboard.createCursorKeys();
          keyboard.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
          keyboard.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        }

        function update() {
            game.physics.arcade.collide(player.phaser, wallsService.walls());
            game.physics.arcade.collide(exitService.exit(), wallsService.walls());
            game.physics.arcade.overlap(player.phaser, exitService.exit(), resetMap, null, this);
            game.physics.arcade.overlap(player.phaser, itemsService.items(), addItem, null, this);

            player.update(keyboard,game);

        }

        function addItem(p,phaserItem){
            player.addItem(phaserItem.item);
            phaserItem.kill();
        }


        function resetMap(){
            destroy();
            generateMap();
        }

        function generateMap() {
            wallsService.generateGroup(game);
            groundsService.generateGroup(game);
            exitService.generateGroup(game);
            itemsService.generateGroup(game);
            trapsService.generateGroup(game);
            generatedMap = mazeService.generateMap(22, 12, generatedMap?generatedMap.exit:null);
            map = generatedMap.map;
          game.map = map;
          game.sizeMap = {
            x : 22*2,
            y : 12*2
          };
          game.currentMap = [];
            var itemsAdded = {};
            for (var y = 0; y < map.length; y++) {
              var tmpMap = [];
              for (var x = 0; x < map[y].length; x++) {
                    if (map[y][x].value == 0) {
                      tmpMap.push(wallsService.addWallToGame(game, x * 32, y * 32));
                    }
                    else {
                      tmpMap.push(groundsService.addGroundToGame(game, x * 32, y * 32));
                        if(!itemsAdded.boots && !Math.floor(Math.random()*100)){
                          itemsAdded.boots = true;
                            itemsService.addItemToGame(itemService.Boots,game, x * 32, y * 32);
                        }
                        else if(!itemsAdded.trickBoots && !Math.floor(Math.random()*100)){
                          itemsAdded.trickBoots = true;
                            itemsService.addItemToGame(itemService.TrickBoots,game, x * 32, y * 32);
                        }
                        else if(!itemsAdded.dynamite && !Math.floor(Math.random()*100)){
                          itemsAdded.dynamite = true;
                          itemsService.addItemToGame(itemService.Dynamite,game, x * 32, y * 32);
                        }
                        else if(!itemsAdded.potion && !Math.floor(Math.random()*100)){
                          itemsAdded.potion = true;
                          itemsService.addItemToGame(itemService.Potion,game, x * 32, y * 32);
                        }
                    }
                    if (generatedMap.exit.i == y && generatedMap.exit.j == x) {
                        exitService.addExitToGame(game, x * 32, y * 32);
                    }
                }
              game.currentMap.push(tmpMap);
            }
            player.addPhaser(game, generatedMap.entrance.j*32, generatedMap.entrance.i*32+3);
          game.reset = resetMap;
        }
        function destroy(){
            game.world.removeAll();
        }

        return {
            game : game
        }

    });