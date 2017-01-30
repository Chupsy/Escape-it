MyApp
    .service('playerService', function () {
        var displayItemGroup;
    var Player = function(velocity){
        var self = this;
        this.velocity = velocity;
        this.inventory = [];

        this.getSpeed = function(){
            var speed = self.velocity;
            self.inventory.map(function(e){
                speed = e.speedModifier(speed);
            });
            return speed;
        };
        
        this.addItem = function(item){
            self.inventory.push(item);
            
            item.setRemove(function(){
                self.inventory.splice(self.inventory.indexOf(item),1);
            });
        };
        
        this.addPhaser = function(game, x , y){
            self.phaser = game.add.sprite(x,y, 'character');
            self.phaser.scale.setTo(0.80, 0.80);
            self.phaser.animations.add('left', [12,13,14], 10, true);
            self.phaser.animations.add('right', [24,25,26], 10, true);
            self.phaser.animations.add('up', [36,37,38], 10, true);
            self.phaser.animations.add('down', [0,1,2], 10, true);
            
            game.physics.arcade.enable(self.phaser);
            self.phaser.frame = 0;

            self.phaser.body.collideWorldBounds = true;
            displayItemGroup = game.add.group();
            //self.speedText = game.add.text(4, 4, 'speed: '+self.getSpeed(), { fontSize: '6px', fill: '#FFF' });
            
        };
        var displayed = false;
        this.update = function(keyboard,game){
            displayItemGroup.removeAll();
            if(self.phaser.body){
                self.phaser.body.velocity.x = 0;
                self.phaser.body.velocity.y = 0;
                var v =self.getSpeed();

                var animationPlayed = false;
                if (keyboard.cursors.left.isDown)
                {
                    //  Move to the left
                    self.phaser.body.velocity.x = -v;
                    self.phaser.animations.play('left');
                    animationPlayed = true;
                }
                else if (keyboard.cursors.right.isDown) {
                    //  Move to the right
                    self.phaser.body.velocity.x = v;
                    self.phaser.animations.play('right');
                    animationPlayed = true;
                }
                else{
                    self.phaser.body.velocity.x = 0;
                }

                if(keyboard.cursors.up.isDown){
                    if(!animationPlayed){
                        self.phaser.animations.play('up');
                    }
                    self.phaser.body.velocity.y = -v;
                    animationPlayed = true;

                }
                else if(keyboard.cursors.down.isDown){
                    if(!animationPlayed){
                        self.phaser.animations.play('down');
                    }
                    self.phaser.body.velocity.y = v;
                    animationPlayed = true;

                }
                else{
                    self.phaser.body.velocity.y = 0;
                }

                if(!animationPlayed){
                    self.phaser.frame = 0;
                }
            }
            self.inventory.map(function(item, index){
                item.update(keyboard,game, self.phaser);
                var displayItem = game.add.sprite(4+(index*32),4, 'items');
                displayItem.scale.setTo(1.5,1.5);
                displayItem.frame = item.frame;
                if(item.timeLeft<3000 && item.timeLeft > 0){
                    displayItem.tint = Math.random() * 0xffffff;
                }
                displayItemGroup.add(displayItem);
            });
        }
    };

    return {
        Player : Player
    }
    
});