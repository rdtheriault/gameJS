var gameJS = {
  widthS: 30,//width of square in pixels
  heightS: 30,//height of square in pixels
  boardW: 10,
  boardH: 10,
  characters: [],
  boardColor: "gainsboro",
  turn: 0,//holds whos turn its on
  turnMov: 0,//holds current movement
  turnAttks: 0,//holds current character attacks for turn
  turnActions: 0,//hold number of actions taken
  turnSpecial: 0,

  //create game board
  createBoard : function(h,w, boardOptions1){
    //this.widthS gets the pixel width of each block (square)
    var boardEl = document.getElementById("gameBoard");
    gameJS.boardW = w;
    gameJS.boardH = h;
    var opts = 0;
    if (boardOptions1){
      //know that there are options
    }

    for (var i = 0; i < h; i++){
      var rowEl = document.createElement("div");//create row
      rowEl.className = "row";
      rowEl.style.display = "flex";
      rowEl.id = "row"+(1+i);
      for (var j = 0; j < w; j++){//create the columns in each row
        var colEl = document.createElement("div");
        colEl.className = "col";
        colEl.style.height = gameJS.heightS+"px";
        colEl.style.width = gameJS.widthS+"px";
        if (boardOptions1){//know that there are options
          var parts = boardOptions1[opts].split(",");
          //colEl.classList.add(parts[1]);
          colEl.className += " "+parts[1];
          colEl.style.background = parts[0];
          opts++;
        }
        else{//no custom board
          colEl.style.background = gameJS.boardColor;//allow to change color
        }
        colEl.style.border = "1px solid white";
        colEl.id = "row"+(1+i)+"_"+"col"+(1+j);
        rowEl.appendChild(colEl);
      }
      boardEl.appendChild(rowEl);
    }

  },
  //
  createLegend: function(defaultGround){//the default color will apply to the Ground
    var legEl = document.getElementById("legend");
    legEl.innerHTML = "";
  },
  //
  createArrows: function() {
    var arEl = document.getElementById("gamePad");
    arEl.innerHTML = '<table><tr><td><img src="pics/nw.png" alt="direction arrow" id="nw"></td><td><img src="pics/n.png" alt="direction arrow" id="n"></td><td><img src="pics/ne.png" alt="direction arrow" id="ne"></td></tr><tr><td><img src="pics/w.png" alt="direction arrow" id="w"></td><td><img src="pics/endTurn.png"  id="endTurn"></td><td><img src="pics/e.png" alt="direction arrow" id="e"></td></tr><tr><td><img src="pics/sw.png" alt="direction arrow" id="sw"></td><td><img src="pics/s.png" alt="direction arrow" id="s"></td><td><img src="pics/se.png" alt="direction arrow" id="se"></td></tr></table>';
    gameJS.hideArrows();//hide arrows until player turn.
    document.getElementById("nw").addEventListener("click",function() {gameJS.move("nw");});
    document.getElementById("n").addEventListener("click",function() {gameJS.move("n");});
    document.getElementById("ne").addEventListener("click",function() {gameJS.move("ne");});
    document.getElementById("w").addEventListener("click",function() {gameJS.move("w");});
    document.getElementById("endTurn").addEventListener("click",function() {gameJS.endTurn("btn");});
    document.getElementById("e").addEventListener("click",function() {gameJS.move("e");});
    document.getElementById("sw").addEventListener("click",function() {gameJS.move("sw");});
    document.getElementById("s").addEventListener("click",function() {gameJS.move("s");});
    document.getElementById("se").addEventListener("click",function() {gameJS.move("se");});
  },
  hideArrows: function(){
    document.getElementById("gamePad").style.display = "none";
  },
  showArrows: function(){
    document.getElementById("gamePad").style.display = "block";
  },


  //player monster npc stats
  character: function(name1, locY1, locX1, hp1, armor1, weapon1, range1, img1, str1, dex1, con1, wis1, int1, cha1, charClass1, lvl1, ai1){
    this.name = name1;
    this.locY = locY1;
    this.locX = locX1;
    this.hp = hp1;
    this.armorClass = gameJS.getArmorClass(armor1,dex1);
    this.armor = armor1;
    this.attk = gameJS.getWeaponDamage(weapon1);
    this.weapon = weapon1;
    this.attks = 1;//may change with class
    this.attkBonus = 0;//dex or str? or class/weapon special?
    this.range = range1;
    this.img = img1;
    this.str = str1;
    this.dex = dex1;
    this.con = con1;
    this.wis = wis1;
    this.int = int1;
    this.cha = cha1;
    this.charClass = charClass1;
    this.lvl = lvl1;
    this.move = 1;//use for AI move sets
    this.dir = "n";//set the direction that character is looking
    this.initiative = 0;
    this.initBonus = 0;//set by class later
    this.special = 1;//may change on class and level
    this.ai = ai1;
    this.prof = 2;//change with level
    this.dead = 0
  },

  //classes "special,times,special2,times,hp,statbonus"
  fighter: [["cleave",1,"none",0,10,"none"],["cleave",2,"none",0,16,"none"],["cleave",3,"none",0,22,"none"],["cleave",3,"none",0,10,"str"],["cleave",3,"none",0,10,"none"]],
  classAbility: function(cls1, lvl1){
    if (lvl1 == 1  && cls1 == "fighter"){
      this.special = "Cleave"
    }
  },

  //weapons and armor
  getWeaponDamage: function(weapon){
    if (weapon == "longsword"){
      return "1d8";
    }
    else if (weapon == "scimitar" || weapon == "shortsword" || weapon == "hammer"){
      return "1d6";
    }
    else if (weapon == "dagger"){
      return "1d4";
    }
  },
  getArmorClass: function(armor, dex){
    var dexMod = gameJS.getProfBonus(dex);
    if (armor == "leather"){
      return 11+dexMod;
    }
    else if (armor == "studdedleather"){
      return 12+dexMod;
    }
  },

  //game mechanics
  checkChars: function(){//check the location of all of the characters

  },
  nextTurn: function(){//reset turn actions with charcters numbers
    gameJS.turnMov = gameJS.characters[gameJS.turn].range;
    gameJS.turnAttks = gameJS.characters[gameJS.turn].attks;
    gameJS.turnSpecial = gameJS.characters[gameJS.turn].special;
    gameJS.turnActions = 1;
    if (gameJS.characters[gameJS.turn].charClass != "monster"){//player
      gameJS.showArrows();

    }
    else{//monster
      if (gameJS.characters[gameJS.turn].ai == "dumb"){
        gameJS.dumbAI();
      }
      else{//must be custom run custom code

      }
    }
  },
  endTurn: function(option){//current are btn and monster stop
    console.log("Ending Turn");
    gameJS.turn++;
    if (gameJS.turn == gameJS.characters.length){//reset turn
      gameJS.turn = 0;
    }
    if (option == "btn"){
      gameJS.hideArrows();
    }

    gameJS.nextTurn();
  },
  move: function(dir1){
    var newX = gameJS.characters[gameJS.turn].locX;
    var newY = gameJS.characters[gameJS.turn].locY;
    var move = 2;//0 = not enough, 1/1.5 = dist, 2 = try
    //check if can move
    if (gameJS.turnMov  < 1.5 && (dir1 == "nw" || dir1 == "sw" || dir1 == "ne" || dir1 == "se")){
      move = 0;
    }
    else if (gameJS.turnMov  < 1 && (dir1 == "n" || dir1 == "w" || dir1 == "e" || dir1 == "s")){
      move = 0;
    }
    //diagonal moves 1.5


    //straight moves 1
    if (dir1 == "n" && move != 0){
      newY = gameJS.characters[gameJS.turn].locY - 1;
      move = 1;
    }
    else if (dir1 == "s" && move != 0){
      newY = gameJS.characters[gameJS.turn].locY + 1;
      move = 1;
    }
    else if (dir1 == "w" && move != 0){
      newX = gameJS.characters[gameJS.turn].locX - 1;
      move = 1;
    }
    else if (dir1 == "e" && move != 0){
      newX = gameJS.characters[gameJS.turn].locX + 1;
      move = 1;
    }
    if (move == 1 || move == 1.5){
      console.log("Checking move of "+gameJS.characters[gameJS.turn].name+" to location "+newX+","+newY)
      if (gameJS.checkBlock(newX, newY)){
        gameJS.turnMov = gameJS.turnMov - move;
        console.log("Player movement is "+gameJS.turnMov);
      }
    }
    else if (move == 0){
      console.log("Player is out of movement");
    }
  },
  checkBlock: function(dirX, dirY){
    if (dirX == "0" || dirY == "0" || dirX > gameJS.boardH || dirY > gameJS.boardW){
      console.log("Out of bounds");
      return false;
    }
    else{
      var location = "row"+dirY+"_col"+dirX;
      var locEl = document.getElementById(location);
      var move = true;
      console.log(locEl.className);
      //if monster - attack
      for (var i = 0; i < gameJS.characters.length;i++){
        if (gameJS.characters[i].name != gameJS.characters[gameJS.turn].name && (gameJS.characters[i].locX == dirX && gameJS.characters[i].locY == dirY)){//if not smae charcter and enemy there
          //if no attacks
          if (gameJS.turnAttks < 1){
            console.log("Player has no Attacks left");
          }
          else{
            //minus attack
            gameJS.turnAttks = gameJS.turnAttks - 1;
            //create attack
            var attkPlus = gameJS.getProfBonus(gameJS.characters[gameJS.turn].str);//make formula for whether to use dex or strength
            var hit = attkPlus+gameJS.characters[gameJS.turn].prof;
            var dmg = gameJS.playerAttack(gameJS.characters[gameJS.turn].attk,hit,gameJS.characters[gameJS.turn].attkBonus,attkPlus, gameJS.characters[i].armorClass);
            if (dmg == 0){
              console.log("Missed "+gameJS.characters[i].name);
            }
            else if (gameJS.characters[i].hp - dmg < 1){
              gameJS.characters[i].hp = gameJS.characters[i].hp - dmg;
              gameJS.death(gameJS.characters[i]);
              console.log("Death of "+gameJS.characters[i].name);
            }
            else{
              gameJS.characters[i].hp = gameJS.characters[i].hp - dmg;
              console.log(gameJS.characters[i].name+" takes "+dmg+" damage, life left = "+gameJS.characters[i].hp);
            }
            ////attack dice, total hit (prof +str/dex),any other bonus,damage bonus (str/dex)
          }
          move = false;
          return false;
        }
      }
      if (locEl.classList.contains("none") && move == true){//might have trouble if it is an item on ground//if wall no move and not out of bounds
        gameJS.removePic(gameJS.characters[gameJS.turn].locX,gameJS.characters[gameJS.turn].locY);
        gameJS.characters[gameJS.turn].locX = dirX;
        gameJS.characters[gameJS.turn].locY = dirY;
        gameJS.placeCharacter(gameJS.characters[gameJS.turn]);
        return true;
      }
    }
  },
  removePic: function(x,y){//use to clear old location or dead character char
    var oldLoc = "row"+y+"_col"+x;
    document.getElementById(oldLoc).innerHTML = "";
  },
  rollInitiative: function(characters){//roll for all characters then reset their order
    for (var i = 0; i < characters.length;i++){
      var dexMod = gameJS.getProfBonus(characters[i].dex);
      characters[i].initiative = gameJS.rollDice("1d20")+dexMod;
    }
    characters.sort((a,b) => (a.initiative < b.initiative) ? 1 : ((b.initiative < a.initiative) ? -1 : 0));
    gameJS.characters =  characters;
  },
  death: function(character){//if character is < 0 they die remove from list and board
    character.dead = 1;
    //remove from board
    gameJS.removePic(character.locX,character.locY);
    character.locX = 0;
    character.locy = 0;
  },
  placeCharacter: function(character){
    var x = character.locX;
    var y = character.locY;
    var location = "row"+y+"_col"+x;//ad later (if not hidden)
    document.getElementById(location).innerHTML = '<img src="pics/'+character.img+'">';
  },
  startGame: function(characters){
    for (var i = 0; i < characters.length;i++){
      gameJS.placeCharacter(characters[i]);
    }
    gameJS.rollInitiative(characters);
    //create arrows
    gameJS.createArrows();

    //add event listeners



    gameJS.nextTurn();
  },

  //rules
  getProfBonus: function(prof){//send stat and then return the prof bonus.
    return Math.floor((prof-10)/2);
  },
  playerAttack: function(attk1, hit1, attkBonus1, dmgBonus1, enemyAC1){//attack dice, total hit (prof +str/dex),any other bonus,damage bonus (str/dex)
    var roll = gameJS.rollDice("1d20");
    if (roll + hit1 + attkBonus1 > enemyAC1){
      return gameJS.rollDice(attk1)+dmgBonus1;
    }
    else {
      return 0;
    }
  },
  rollDice: function(dice){
    var parts = dice.split("d")
    var num = parts[0];//number of dice
    var sides = parts[1];//number of sides
    var total = 0;
    for (var i = 0;i < num;i++){
      total += Math.floor(Math.random() * sides) + 1;
    }
    console.log("Dice roll = "+total)
    return total; //total roll
  },

  //AI
  dumbAI: function(){
    var canAttack = false;
    var timeExtender = 1;
    if (canAttack){
      //who can it attack
      var attkPlus = gameJS.getProfBonus(gameJS.characters[gameJS.turn].str);//make formula for whether to use dex or strength
      var hit = attkPlus+gameJS.characters[gameJS.turn].prof;
      var dmg = gameJS.playerAttack(gameJS.characters[gameJS.turn].attk,hit,gameJS.characters[gameJS.turn].attkBonus,attkPlus, enmeyAC );//fill out
      //who got hit takes dmg "say miss if zero"
    }
    else {
      //var dirs = ["n","nw","w","sw","s","se","e","ne"];
      var dirs = ["n","w","s","e"];
      var dir = dirs[Math.floor(Math.random() * dirs.length)];;
      gameJS.move(dir);
    }

    //if not end of
    if (gameJS.turnMov < 1){
      console.log("Dumb enemy turn is over")
      gameJS.endTurn("enemy");
    }
    else{
      setTimeout(gameJS.dumbAI(),1000*timeExtender);
      timeExtender++;
    }
  },
  simpleAI: function(){

  },

  //multiroom
  teleport: function(){

  },

  //other stuff
  timer: function(time){
    setTimeout(function(){ alert("Hello"); }, 3000);
  },
};
//pregen enemies
var goblin =  new gameJS.character("Goblin",0,0,4,"leather","dagger",4,"goblin.png",10,14,12,8,8,6,"monster",1,"dumb"); //goblin.locY = 0;


//how to create a pregen character
//var goblin2 = Object.create(goblin);//copy all goblin stats
//goblin2.name = "Goblin2";//rename
//goblin2.locY = 4;//change y location
//goblin2.locX - 5;//change x location

//How to create or use character creator
//var myCharacter =  new gameJS.character("Steve",10,8,14,"1d8",4,"imgLoc");
