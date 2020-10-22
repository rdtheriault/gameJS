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
  //turnSpecial: 0,
  turnDeath: [],//track those who die that turn
  turnIsSpecialAttk: ["false",1],//are they using a spcial attk this round and which one
  endState: "death",



  //create game board
  createBoard : function(h,w, boardOptions1){
    //this.widthS gets the pixel width of each block (square)
    var boardEl = document.getElementById("gameBoard");
    gameJS.boardW = w;
    gameJS.boardH = h;
    var opts = 0;

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
          var parts = boardOptions1[opts].split(",");//count through each opt every board piece
          //colEl.classList.add(parts[1]);
          if (parts[2] == "d1"){
            colEl.innerHTML = '<img src="pics/keyHole.png">';
          }
          else if (parts[2] == "k1"){
            colEl.innerHTML = '<img src="pics/key.png">';
            colEl.className += " "+parts[2];
          }
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
  //do all the stuff needed to set up each board piece
  checkBoardOptions: function(parts, el){

  },
  //
  createLegend: function(defaultGround){//the default color will apply to the Ground
    var legEl = document.getElementById("legend");
    legEl.innerHTML = "";
  },
  //
  createArrows: function() {
    var arEl = document.getElementById("gamePad");
    arEl.innerHTML = '<table><tr><td><img src="pics/nw.png" alt="direction arrow" id="nw"></td><td><img src="pics/n.png" alt="direction arrow" id="n"></td><td><img src="pics/ne.png" alt="direction arrow" id="ne"></td></tr><tr><td><img src="pics/w.png" alt="direction arrow" id="w"></td><td><img src="pics/endTurn.png"  id="endTurn"></td><td><img src="pics/e.png" alt="direction arrow" id="e"></td></tr><tr><td><img src="pics/sw.png" alt="direction arrow" id="sw"></td><td><img src="pics/s.png" alt="direction arrow" id="s"></td><td><img src="pics/se.png" alt="direction arrow" id="se"></td></tr><tr style="font-size:8px;"><td><div>Special 1</div><div id="spec1"></div></td><td><div>Special 2</div><div id="spec2"></div></td><td><div>Special 3</div><div id="spec3"></div></td></tr></table>';
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

  updateMsg: function(msg){
    document.getElementById("msgBoxInner").innerHTML += (msg+"<br>");
    document.getElementById("statPlayer").innerHTML = gameJS.characters[gameJS.turn].name;
    document.getElementById("statMov").innerHTML = gameJS.turnMov;
    document.getElementById("statAttk").innerHTML = gameJS.turnAttks;
    document.getElementById("statAct").innerHTML = gameJS.turnActions;
    document.getElementById("statHP").innerHTML = gameJS.characters[gameJS.turn].hp;
    var myDiv = document.getElementById("msgBoxInner");
    myDiv.scrollTop = myDiv.scrollHeight;
  },


  //player monster npc stats
  character: function(name1, locY1, locX1, hp1, armor1, weapon1, range1, img1, str1, dex1, con1, wis1, int1, cha1, charClass1, lvl1, ai1, type1){
    this.name = name1;
    this.locY = locY1;
    this.locX = locX1;
    this.classStats = gameJS.returnClass(charClass1);
    if (charClass1 == "monster" || charClass1 == "npc"){
      this.hp = hp1;
    }
    else{//get based on class and level
      this.hp = hp1;
    }
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
    this.type = type1;
    this.move = 1;//use for AI move sets
    this.dir = "n";//set the direction that character is looking
    this.initiative = 0;
    this.initBonus = 0;//set by class later
    this.special1 = "";//may change on class and level
    this.special1times = 1;//change based on class
    this.ai = ai1;
    this.prof = 2+Math.floor((lvl1-1) / 4);//change with level
    this.dead = 0;
    this.items = [];
  },

  //classes "hp,statbonus,special,times,special2,times"
  fighter: [[10,"none","cleave",1,"none",0],[16,"none","cleave",1,"none",0],[22,"none","cleave",2,"none",0],[28,"str","cleave",2,"none",0],[34,"none","cleave",3,"none",0]],
  cleric: [[8,"none","heal6",1,"none",0],["heal6",1,"none",0,13,"none"],[18,"none","heal6",2,"none",0],[23,"wis","heal6",2,"none",0],[28,"none","heal8",2,"none",0]],
  ninja: [],
  returnClass: function(charClass){
    if (charClass == "fighter"){
      return gameJS.fighter;
    }
    else if (charClass == "cleric"){
      return gameJS.cleric;
    }
  },

  useSpecial: function(spec){
    if (spec == "cleave"){
      gameJS.turnAttks += 1;
    }
    else if (spec.includes("heal")){

    }
  },
  manageSpecial: function(specNum, spec){
    if (gameJS.characters[gameJS.turn].special1times > 0 && specNum == 1){
      gameJS.characters[gameJS.turn].special1times -= 1;
      gameJS.useSpecial(spec);
    }
    else if (gameJS.characters[gameJS.turn].special2times > 0 && specNum == 2){
      gameJS.characters[gameJS.turn].special2times -= 1;
      gameJS.useSpecial(spec);
    }
    else if (gameJS.characters[gameJS.turn].special3times > 0 && specNum == 3){
      gameJS.characters[gameJS.turn].special3times -= 1;
      gameJS.useSpecial(spec);
    }
  },

  //weapons and armor
  getWeaponDamage: function(weapon){
    if (weapon == "longsword"){
      return "1d8";
    }
    else if (weapon == "scimitar" || weapon == "shortsword" || weapon == "hammer" || weapon == "staff"){
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
    gameJS.updateMsg("New Turn -> Character = "+gameJS.characters[gameJS.turn].name);
    if (gameJS.characters[gameJS.turn].type != "monster"){//player
      gameJS.showArrows();

    }
    else{//monster
      gameJS.checkAI(gameJS.characters[gameJS.turn].ai);//get the nonplayers AI and run it
    }
  },

  checkAI: function(ai){
    if (ai == "dumb"){
      gameJS.dumbAI();
    }
    else if (ai == "simple"){
      gameJS.simpleAI();
    }
    else{//must be custom run custom code

    }
  },

  endTurn: function(option){//current are btn and monster stop
    console.log("Ending Turn");
    if (option == "btn"){
      gameJS.hideArrows();
    }
    gameJS.deleteDead();
    gameJS.turn++;
    if (gameJS.turn >= gameJS.characters.length){//reset turn
      gameJS.turn = 0;
    }
    setTimeout(gameJS.nextTurn,500);//give deleteDead time to work.
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
        console.log(gameJS.characters[gameJS.turn].name+" movement is "+gameJS.turnMov);
      }
    }
    else if (move == 0){
      console.log(gameJS.characters[gameJS.turn].name+" is out of movement");
      gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" is out of movement");
    }
  },

  checkBlock: function(dirX, dirY){
    if (dirX == "0" || dirY == "0" || dirX > gameJS.boardW || dirY > gameJS.boardH){//if out of bounds
      console.log("Out of bounds");
      gameJS.updateMsg("Out of bounds");
      return false;//didn't move
    }
    else{//else first check for enemy, then check if can move
      var location = "row"+dirY+"_col"+dirX;
      var locEl = document.getElementById(location);
      var move = true;//use to stop movement check if player uses attack
      console.log(locEl.className);
      //if monster - attack
      move = gameJS.checkMovt4Attk(dirX, dirY);//check if can attack, attack, else can try to move.
      if (locEl.classList.contains("none") && move == true){//might have trouble if it is an item on ground//if wall no move and not out of bounds
        gameJS.removePic(gameJS.characters[gameJS.turn].locX,gameJS.characters[gameJS.turn].locY);
        gameJS.characters[gameJS.turn].locX = dirX;
        gameJS.characters[gameJS.turn].locY = dirY;
        gameJS.placeCharacter(gameJS.characters[gameJS.turn]);
        return true;//moved
      }
    }
  },

  checkMovt4Attk: function(dirX, dirY){//check to see if movement is an attack
    for (var i = 0; i < gameJS.characters.length;i++){
      if (gameJS.characters[i].name != gameJS.characters[gameJS.turn].name && (gameJS.characters[i].locX == dirX && gameJS.characters[i].locY == dirY)){//if not smae charcter and enemy there
        //if no attacks
        if (gameJS.turnAttks < 1){
          console.log(gameJS.characters[gameJS.turn].name+" has no Attacks left");
          gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" has no Attacks left");
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
            gameJS.updateMsg("Missed "+gameJS.characters[i].name);
          }
          else if (gameJS.characters[i].hp - dmg < 1){
            gameJS.characters[i].hp = gameJS.characters[i].hp - dmg;
            gameJS.death(gameJS.characters[i]);
            console.log("Death of "+gameJS.characters[i].name);
            gameJS.updateMsg("Death of "+gameJS.characters[i].name);
          }
          else{
            gameJS.characters[i].hp = gameJS.characters[i].hp - dmg;
            console.log(gameJS.characters[i].name+" takes "+dmg+" damage, life left = "+gameJS.characters[i].hp);
          }
          ////attack dice, total hit (prof +str/dex),any other bonus,damage bonus (str/dex)
        }
        return false;//attacked, don't move
      }
    }
    return true;//didn't attack, go ahead and try to move
  },

  setEndState:function(goal){
    gameJS.endState = goal;
  },
  checkEndState: function(){
    //if goal kill enemy check if all dead

    //if goal home check if they are at end block

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
    character.locY = 0;
    if (character.type != "monster"){//will need mod for npc and or multiplayer
      document.body.innerHTML = '<h1 style="text-align:center;">You done died</h1><h2 style="text-align:center;">Please refresh the page to try again</h2>';
    }
    gameJS.turnDeath.push(character);
    console.log(gameJS.turnDeath);
  },

  deleteDead: function(){//delete the dead at the end of the turn
    if (gameJS.turnDeath.length >= 1){
      for (var i = 0; i < gameJS.turnDeath.length;i++){
        for (var j = 0; j < gameJS.characters.length;j++){
          if (gameJS.turnDeath[i].name == gameJS.characters[j].name){
            gameJS.characters.splice(j,1);
          }
        }
      }
    }
    //console.log(gameJS.characters);//who is left
    gameJS.turnDeath = [];
  },

  placeCharacter: function(character){
    var x = character.locX;
    var y = character.locY;
    var location = "row"+y+"_col"+x;//add later (if not hidden)
    document.getElementById(location).innerHTML = '<img src="pics/'+character.img+'">';
  },

  startGame: function(characters){
    for (var i = 0; i < characters.length;i++){
      gameJS.placeCharacter(characters[i]);
    }
    gameJS.rollInitiative(characters);
    gameJS.createArrows();
    gameJS.updateMsg("Starting Game");
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
      setTimeout(gameJS.dumbAI,500);
      gameJS.updateMsg("dumbAI action");
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
  playSound: function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  },

  //change layout of page (mobile, standard....)

};
//pregen enemies
var goblin =  new gameJS.character("Goblin",0,0,4,"leather","dagger",4,"goblin.png",10,14,12,8,8,6,"fighter",1,"dumb","monster"); //goblin.locY = 0;


//how to create a pregen character
//var goblin2 = Object.create(goblin);//copy all goblin stats
//goblin2.name = "Goblin2";//rename
//goblin2.locY = 4;//change y location
//goblin2.locX - 5;//change x location

//How to create or use character creator
//var myCharacter =  new gameJS.character("Steve",10,8,14,"1d8",4,"imgLoc");
