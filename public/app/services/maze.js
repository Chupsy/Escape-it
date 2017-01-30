MyApp
    .service('mazeService', function () {


        const CONSTANTS = {
            WALL : 0,
            PATH : 1
        };
        var Tile = function(value){
            this.value = value;
        };

        var Wall = function(tile1, tile2){
            this.tile1 = tile1;
            this.tile2 = tile2;
        };

        var WallMap = function(){
            this.wallList = [];

            this.addWall = function(wall){
                this.wallList.push(wall);
            };

            this.getWall = function(tile1,tile2){
                for(var i = 0; i< this.wallList.length; i++){
                    var w = this.wallList[i];
                    if((w.tile1 == tile1 && w.tile2 == tile2)||(w.tile1 == tile2 && w.tile2 == tile1)){
                        return w;
                    }
                }
                return null;
            };

            this.deleteWall = function(index){
                this.wallList.splice(index,1);
            };

            this.findWallWithDifferentTileValues = function(){
                var wallsWithDifferentValues = [];
                for(var i = 0; i< this.wallList.length; i++){
                    var w = this.wallList[i];
                    if(w.tile1.value != w.tile2.value){
                        wallsWithDifferentValues.push({
                            wall : w,
                            index : i
                        });
                    }
                }
                return wallsWithDifferentValues.length?wallsWithDifferentValues[Math.floor(Math.random()*wallsWithDifferentValues.length)]:null;
            };
        };

        function generateTheMap(mapWidth, mapHeight,lastExit){
            if(!mapHeight){
                mapHeight = mapWidth;
            }
            var map = [];
            var wallMap = new WallMap();
            for(var i = 0; i<mapHeight; i++){
                var tmpMap = [];
                for(var j = 0; j<mapWidth; j++){
                    var t = new Tile((mapWidth*i) + j);
                    //top wall
                    if(i>0){
                        wallMap.addWall(new Wall(t, map[i-1][j]));
                    }
                    //left wall
                    if(j>0){
                        wallMap.addWall(new Wall(t, tmpMap[j-1]));
                    }

                    tmpMap.push(t)
                }
                map.push(tmpMap);
            }

            function processMap(){
                function flattenTiles(a, b){
                    for(var i = 0; i<mapHeight; i++){
                        for(var j = 0; j<mapWidth; j++){
                            if(map[i][j].value == a){
                                map[i][j].value = b;
                            }
                        }
                    }
                }
                var w;
                while(w = wallMap.findWallWithDifferentTileValues()){
                    flattenTiles(w.wall.tile1.value, w.wall.tile2.value);
                    wallMap.deleteWall(w.index);
                }
            }

            function generateMap(){
                var entrance =lastExit?(lastExit.i-1)/2 :  Math.floor(Math.random()*mapHeight);
                var exit = Math.floor(Math.random()*mapHeight);
                var entranceCoordinates, exitCoordinates;
                var generatedMap = [];
                for(var i = 0; i<mapHeight; i++){
                    var rowWall = [];
                    var rowNumber = [];
                    for(var j = 0; j<mapWidth; j++){
                        var t = map[i][j];

                        //left wall
                        if(j == 0 || (j>0 && wallMap.getWall(t, map[i][j-1]))){
                            rowWall.push(new Tile(CONSTANTS.WALL));
                            if(i == entrance && j == 0){
                                entranceCoordinates = {
                                    i : (entrance*2)+1,
                                    j : 0
                                };
                                rowNumber.push(new Tile(CONSTANTS.PATH));
                            }
                            else{
                                rowNumber.push(new Tile(CONSTANTS.WALL));
                            }
                        }
                        else{
                            if(i>0){
                                rowWall.push(new Tile(CONSTANTS.PATH));
                            }
                            else{
                                rowWall.push(new Tile(CONSTANTS.WALL));
                            }
                            rowNumber.push(new Tile(CONSTANTS.PATH));
                        }

                        //top wall
                        if(i == 0 || (i>0 && wallMap.getWall(t, map[i-1][j]))){
                            rowWall.push(new Tile(CONSTANTS.WALL));
                        }

                        else{
                            rowWall.push(new Tile(CONSTANTS.PATH));
                        }

                        //right wall

                        rowNumber.push(new Tile(CONSTANTS.PATH));
                        if(j+1 == mapWidth){
                            rowWall.push(new Tile(CONSTANTS.WALL));
                            if(i == exit){
                                exitCoordinates = {
                                    i : (exit*2)+1,
                                    j : (mapWidth*2)
                                };

                                rowNumber.push(new Tile(CONSTANTS.PATH));
                            }
                            else{
                                rowNumber.push(new Tile(CONSTANTS.WALL));
                            }
                        }
                    }
                    generatedMap.push(rowWall);
                    generatedMap.push(rowNumber);
                }
                var tmp = [];
                for(var i = 0; i<mapWidth; i++){
                    tmp.push(new Tile(CONSTANTS.WALL));
                    tmp.push(new Tile(CONSTANTS.WALL));
                }
                tmp.push(new Tile(CONSTANTS.WALL));
                generatedMap.push(tmp);

                return {
                    map : generatedMap,
                    entrance : entranceCoordinates,
                    exit : exitCoordinates
                };
            }

            processMap();

            return generateMap();
        }

    return {
        generateMap : generateTheMap
    }
    
});