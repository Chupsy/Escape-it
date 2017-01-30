module.exports = function(width, height){
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