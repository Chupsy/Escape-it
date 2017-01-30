MyApp
    .service('itemService', function ($timeout, $interval, groundsService) {
      var bombExploding = false;
      var potionUsed = false;

        var Item = function(){
            this.speedModifier = (s)=>s;
            this.setRemove = () =>{};
            this.update = () => {};
        };

        var Boots = function(m, t){
          this.name = 'Boots';
          var self = this;
            var modifier = m || 100;
            var timeout = t || 5000;
          this.frame = 342;
          this.timeLeft = 0;

            Item.apply(this, arguments);

            this.speedModifier = (speed)=> speed+modifier;

            this.setRemove = function(f){
                if(timeout>0){
                    self.timeLeft = timeout;
                    var i =$interval(function(){
                      if(self.timeLeft <=0){
                        $interval.cancel(i);
                      }
                      else{
                        self.timeLeft -=1000;
                      }
                    }, 1000);
                    $timeout(function(){
                        f();
                    },timeout)
                }
            };
        };

        var TrickBoots = function(t){
          this.name = 'TrickBoots';
          var self = this;
          this.frame = 341;
          var timeout = t || 5000;
          this.timeLeft = 0;

            Item.apply(this, arguments);

            this.speedModifier = (speed)=> -speed;

            this.setRemove = function(f){
              self.timeLeft = timeout;
              var i =$interval(function(){
                if(self.timeLeft <=0){
                  $interval.cancel(i);
                }
                else{
                  self.timeLeft -=1000;
                }
              }, 1000);
                if(timeout>0){
                    $timeout(function(){
                        f();
                    },timeout)
                }
            };
        };

      var Dynamite = function(){
        var self = this;
        this.name = 'Dynamite';
        this.frame = 230;
        Item.apply(this, arguments);
        this.update = function(keyboard,game, player){
            if(keyboard.space.isDown && !bombExploding){
              bombExploding = true;
              this.removeFunction();
              var dynamite = game.add.sprite(player.position.x,player.position.y, 'items');
              var x = player.position.x;
              var y = player.position.y;
              dynamite.scale.setTo(1.5,1.5);
              dynamite.animations.add('willExplode', [230,228], 4, true);
              dynamite.animations.play('willExplode');
              var playerDied = false;
              $timeout(function(){
                var explosion = game.add.sprite(x-32,y-32, 'explosion');
                explosion.scale.setTo(0.5,0.5);
                explosion.animations.add('explosion', [1,2,3,4,5], 10, true);
                explosion.animations.play('explosion');
                dynamite.destroy();
                if(player.position.x > x-45 && player.position.x < x + 45 && player.position.y > y-45 && player.position.y < y + 45 ) {
                  player.destroy();
                  var diedText = game.add.text(game.world.centerX, game.world.centerY, 'You died !', {
                    fontSize: '40px',
                    fill: '#000'
                  });
                  playerDied = true;
                }

                  var destroy = [];
                  var finalDestroy = [];
                  destroy.push({
                    wall : !game.map[Math.round(y/32)-1][Math.round(x/32)].value,
                    x : Math.round(x/32),
                    y : Math.round(y/32)-1
                  });
                  destroy.push({
                    wall : !game.map[Math.round(y/32)+1][Math.round(x/32)].value,
                    x : Math.round(x/32),
                    y : Math.round(y/32)+1
                  });
                  destroy.push({
                    wall : !game.map[Math.round(y/32)][Math.round(x/32)-1].value,
                    x : Math.round(x/32)-1,
                    y : Math.round(y/32)
                  });
                  destroy.push({
                    wall : !game.map[Math.round(y/32)][Math.round(x/32)+1].value,
                    x : Math.round(x/32)+1,
                    y : Math.round(y/32)
                  });
                  destroy.push({
                    wall : !game.map[Math.round(y/32)-1][Math.round(x/32)-1].value,
                    x : Math.round(x/32)-1,
                    y : Math.round(y/32)-1
                  });
                  destroy.push({
                    wall : !game.map[Math.round(y/32)-1][Math.round(x/32)+1].value,
                    x : Math.round(x/32)+1,
                    y : Math.round(y/32)-1
                  });
                  destroy.push({
                    wall : !game.map[Math.round(y/32)+1][Math.round(x/32)-1].value,
                    x : Math.round(x/32)-1,
                    y : Math.round(y/32)+1
                  });
                  destroy.push({
                    wall : !game.map[Math.round(y/32)+1][Math.round(x/32)+1].value,
                    x : Math.round(x/32)+1,
                    y : Math.round(y/32)+1
                  });
                  destroy.map(function(e){
                    if(e.wall && e.x && e.y && e.x && e.y<game.sizeMap.y && e.x<game.sizeMap.x){
                      finalDestroy.push(e);
                    }
                  });
                  finalDestroy.map(function(e){
                    var wall = game.currentMap[e.y][e.x];
                    wall.destroy();
                    groundsService.addGroundToGame(game, e.x*32, e.y*32);
                  });
                  $timeout(function(){
                    bombExploding = false;
                    explosion.destroy();
                    if(playerDied){
                      $timeout(function () {
                        game.reset();
                      }, 2000);
                    }
                  },500);
              },3000)
            }
          };
        this.setRemove = function(f){
          this.removeFunction = f;
        };
      };
      
      var Potion = function(){
        var self = this;
        this.name = 'Potion';
        this.frame = 361;
        Item.apply(this, arguments);
        this.setRemove = function(f){
          this.removeFunction = f;
        };
        this.update = function(keyboard,game, player){
          if(keyboard.enter.isDown && !potionUsed){
            self.removeFunction();
            var g = groundsService.ground();
            var t = Math.floor(Math.random()*g.children.length);
            var w = g.children[t];
            player.body.position = new Phaser.Point(w.x, w.y)
            potionUsed = true;
            $timeout(function(){
              potionUsed = false;
            },1500)
          }
        };

      };

      return {
            Boots : Boots,
            TrickBoots : TrickBoots,
            Dynamite : Dynamite,
            Potion : Potion
        }

    });