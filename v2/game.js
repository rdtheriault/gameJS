var gameJS = {
  widthS: 30,//width of square in pixels
  heightS: 30,//height of square in pixels
  boardW: 10,
  boardH: 10,
  characters: [],
  nonPlayerTime: 500,
  winMsg: '<h1 style="text-align:center;">You gone and won the level</h1><h2 style="text-align:center;">Please refresh the page to play again</h2>',
  boardColor: "gainsboro",
  turn: 0,//holds whos turn its on
  turnMov: 0,//holds current movement
  turnAttks: 0,//holds current character attacks for turn
  turnActions: 0,//hold number of actions taken
  //turnSpecial: 0,
  turnDeath: [],//track those who die that turn
  turnIsSpecialAttk: [false,"dmg",0],//are they using a spcial attk this round, what damage, and which one
  endState: "death",
  endStatesComplete: [],//will hold endstates for when they need to complete more than one
  end: false,//is the endState met?



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
          gameJS.checkBoardOptions(parts,colEl);
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
  checkBoardOptions: function(parts, colEl){
    if (parts[2].includes("d")){
      colEl.innerHTML = '<img src="pics/keyHole.png">';
      colEl.className += " "+parts[1];
      colEl.className += " door"+parts[2].slice(-1);//add number to door
    }
    else if (parts[2].includes("k")){
      colEl.innerHTML = '<img src="pics/key.png">';
      colEl.className += " key";
      colEl.className += " key"+parts[2].slice(-1);//add number to key
    }
    else if (parts[2].includes("h")){//hide acutal element so it can be show later (will allow hide of objects)
      colEl.style.visibility = 'hidden';
      colEl.className += " "+parts[1];
      colEl.className += " hide"+parts[2].slice(-1);//add number to hide to track to door
    }
    else{
      colEl.className += " "+parts[1];
    }
    colEl.style.background = parts[0];

  },

  addExit: function(dirX,dirY,color){
    //"row"+(1+i)+"_"+"col"+(1+j);
    var changeEl = document.getElementById("row"+(dirY)+"_"+"col"+(dirX));
    changeEl.className += " exit";
    changeEl.style.background = color;
  },

  addItem: function(dirX,dirY,fileLoc, item, fromUser){
    var changeEl = document.getElementById("row"+(dirY)+"_"+"col"+(dirX));
    if (fromUser){//fix class if user created it
      changeEl.classList.remove("none");
      if(item.includes("key")){
        changeEl.className += (" key");
      }
      else{
        changeEl.className += (" item");
      }
      changeEl.className += (" "+item);
    }
    changeEl.innerHTML = '<img src="pics/'+fileLoc+'"">';
  },

  createLegend: function(defaultGround){//the default color will apply to the Ground
    var legEl = document.getElementById("legend");
    legEl.innerHTML = "";
  },
  //
  createArrows: function() {
    var arEl = document.getElementById("gamePad");
    arEl.innerHTML = '<table><tr><td><img src="pics/nw.png" alt="direction arrow" id="nw"></td><td><img src="pics/n.png" alt="direction arrow" id="n"></td><td><img src="pics/ne.png" alt="direction arrow" id="ne"></td></tr><tr><td><img src="pics/w.png" alt="direction arrow" id="w"></td><td><img src="pics/endTurn.png"  id="endTurn"></td><td><img src="pics/e.png" alt="direction arrow" id="e"></td></tr><tr><td><img src="pics/sw.png" alt="direction arrow" id="sw"></td><td><img src="pics/s.png" alt="direction arrow" id="s"></td><td><img src="pics/se.png" alt="direction arrow" id="se"></td></tr><tr style="font-size:8px;"><td><div>Special 1</div><div id="spec1"></div><div id="spec1times"></div></td><td><div>Special 2</div><div id="spec2"></div><div id="spec2times"></div></td><td><div>Special 3</div><div id="spec3"></div><div id="spec3times"></div></td></tr></table>';
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
    document.getElementById("spec1").addEventListener("click",function() {gameJS.manageSpecial(1,gameJS.characters[gameJS.turn].classStats[gameJS.characters[gameJS.turn].lvl-1][2]);});
    document.getElementById("spec1").innerHTML = gameJS.characters[gameJS.turn].classStats[gameJS.characters[gameJS.turn].lvl-1][2];//get level of charcater and 2 is special 1
    document.getElementById("spec1times").innerHTML = gameJS.characters[gameJS.turn].special1times;//get level of charcater and 2 is special 1
    document.getElementById("spec2").addEventListener("click",function() {gameJS.manageSpecial(2,gameJS.characters[gameJS.turn].classStats[gameJS.characters[gameJS.turn].lvl-1][4]);});
    document.getElementById("spec2").innerHTML = gameJS.characters[gameJS.turn].classStats[gameJS.characters[gameJS.turn].lvl-1][4];//get level of charcater and 2 is special 1
    document.getElementById("spec2times").innerHTML = gameJS.characters[gameJS.turn].special2times;//get level of charcater and 2 is special 1
  },
  hideArrows: function(){
    document.getElementById("gamePad").style.display = "none";
  },
  showArrows: function(){
    gameJS.createArrows();
    document.getElementById("gamePad").style.display = "block";
  },
  addWASD: function(){
    document.body.onkeyup = function(e){
      if(e.keyCode == 38||e.keyCode == 87){
        gameJS.move("n");console.log('n');
      }
      if(e.keyCode == 37||e.keyCode == 65){
        gameJS.move("w");console.log('w');
      }
      if(e.keyCode == 40||e.keyCode == 83){
        gameJS.move("s");console.log('s');
      }
      if(e.keyCode == 39||e.keyCode == 68){
        gameJS.move("e");console.log('e');
      }
    }
  },

  updateMsg: function(msg){
    if (msg != "none"){
      document.getElementById("msgBoxInner").innerHTML += (msg+"<br>");
    }
    document.getElementById("statPlayer").innerHTML = gameJS.characters[gameJS.turn].name;
    document.getElementById("statMov").innerHTML = gameJS.turnMov;
    document.getElementById("statAttk").innerHTML = gameJS.turnAttks;
    document.getElementById("statAct").innerHTML = gameJS.turnActions;
    document.getElementById("statHP").innerHTML = gameJS.characters[gameJS.turn].hp;
    var myDiv = document.getElementById("msgBoxInner");
    myDiv.scrollTop = myDiv.scrollHeight;
  },


  //player monster npc stats
  character: function(name1, locY1, locX1, hp1, armor1, weapon1, offhand1, range1, img1, str1, dex1, con1, wis1, int1, cha1, charClass1, lvl1, ai1, type1){
    this.name = name1;
    this.locY = locY1;
    this.locX = locX1;
    this.classStats = gameJS.returnClass(charClass1);
    if (type1 == "monster" || type1 == "npc"){
      this.hp = hp1;
      this.maxHP = hp1;
    }
    else{//get based on class and level + con*lvl
      this.hp = this.classStats[lvl1-1][0]+(gameJS.getProfBonus(con1)*lvl1);
      this.maxHP = this.classStats[lvl1-1][0]+(gameJS.getProfBonus(con1)*lvl1);
    }
    var ac = gameJS.getArmorClass(armor1,dex1);
    this.armor = armor1;
    if (offhand1 == "shield"){ac += 2;}
    this.armorClass = ac;
    this.attk = gameJS.getWeaponDamage(weapon1);
    this.weapon = weapon1;
    this.attks = 1;//may change with class
    if (this.classStats[lvl1-1][8] == "str"){
      this.attkBonus = gameJS.getProfBonus(str1);
    }
    else if (this.classStats[lvl1-1][8] == "dex"){
      this.attkBonus = gameJS.getProfBonus(dex1);
    }
    this.offhand = offhand1;
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
    this.special1times = this.classStats[lvl1-1][3];//based on class
    this.special2 = "";//may change on class and level
    this.special2times = this.classStats[lvl1-1][5];//based on class
    this.ai = ai1;
    this.prof = 2+Math.floor((lvl1-1) / 4);//change with level
    this.dead = 0;
    this.items = [];
  },

  //classes "hp,statbonus,special,times,special2,times"
  fighter: [[10,"none","cleave",1,"none",0,"none",0,"str"],[16,"none","cleave",1,"none",0,"none",0,"str"],[22,"none","cleave",1,"heal6",1,"none",0,"str"],[28,"str","cleave",2,"heal6",1,"none",0,"str"],[34,"none","cleave",2,"heal6",1,"none",0,"str"]],
  cleric: [[8,"none","heal6",1,"none",0,"none",0,"str"],[13,"none","heal6",1,"none",0,"none",0,"str"],[18,"none","heal6",2,"none",0,"none",0,"str"],[23,"wis","heal6",2,"none",0,"none",0,"str"],[28,"none","heal8",2,"none",0,"none",0,"str"]],
  thief: [[8,"none","sneak1d6",1,"none",0,"none",0,"dex"],[13,"none","sneak1d6",1,"none",0,"none",0,"dex"],[18,"none","sneak2d6",1,"none",0,"none",0,"dex"],[23,"wis","sneak2d6",1,"none",0,"none",0,"dex"],[28,"none","sneak3d6",1,"sneak1d6",1,"none",0,"dex"]],
  //ninja: [[9,"none","sneak1d6",1,"none",0,"none",0,"dex"],[14,"none","sneak1d6",1,"none",0,"none",0,"dex"],[20,"none","sneak1d6",1,"cleave",1,"none",0,"dex"],[25,"dex","sneak1d6",1,"cleave",1,"none",0,"dex"],[31,"none","sneak2d6",1,"cleave",1,"none",0,"dex"]],
  returnClass: function(charClass){
    if (charClass == "fighter"){return gameJS.fighter;}
    else if (charClass == "cleric"){return gameJS.cleric;}
    else if (charClass == "thief"){return gameJS.thief;}
    //else if (charClass == "ninja"){return gameJS.ninja;}
  },

  useSpecial: function(specNum, spec){
    if (spec == "cleave"){
      gameJS.turnAttks += 1;
      gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" just used cleave");
    }
    else if (spec.includes("heal")){
      var dice = "1d"+spec.slice(-1);
      var bonus = 0;
      if (gameJS.characters[gameJS.turn].charClass == "fighter"){
        bonus = gameJS.getProfBonus(gameJS.characters[gameJS.turn].con);
        gameJS.heal(bonus,dice);
      }
      else if (gameJS.characters[gameJS.turn].charClass == "cleric"){
        bonus = gameJS.getProfBonus(gameJS.characters[gameJS.turn].wis);
        gameJS.heal(bonus,dice);
      }
      else if (gameJS.characters[gameJS.turn].charClass == "ninja"){
        bonus = gameJS.getProfBonus(gameJS.characters[gameJS.turn].int);
        gameJS.heal(bonus,dice);
      }
    }
    else if (spec.includes('sneak')){
      gameJS.turnIsSpecialAttk[0] = true;
      gameJS.turnIsSpecialAttk[1] = spec.slice(-3);//get dice roll
      gameJS.turnIsSpecialAttk[2] = specNum;
      gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" just used sneak attack");
    }
    else{
      gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" just used 'none''");
    }
  },
  manageSpecial: function(specNum, spec){
    if (gameJS.characters[gameJS.turn].special1times > 0 && specNum == 1){
      gameJS.characters[gameJS.turn].special1times -= 1;
      document.getElementById("spec1times").innerHTML = gameJS.characters[gameJS.turn].special1times;
      gameJS.useSpecial(specNum, spec);
    }
    else if (gameJS.characters[gameJS.turn].special2times > 0 && specNum == 2){
      gameJS.characters[gameJS.turn].special2times -= 1;
      document.getElementById("spec2times").innerHTML = gameJS.characters[gameJS.turn].special2times;
      gameJS.useSpecial(specNum, spec);
    }
    else if (gameJS.characters[gameJS.turn].special3times > 0 && specNum == 3){
      gameJS.characters[gameJS.turn].special3times -= 1;
      gameJS.useSpecial(specNum, spec);
    }
    else{
      gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" is out of special -> "+spec);
    }
  },

  heal: function(bonus,dice){
    var newHealth = gameJS.characters[gameJS.turn].hp + (gameJS.rollDice(dice)+bonus);
    if (newHealth > gameJS.characters[gameJS.turn].maxHP){
      gameJS.characters[gameJS.turn].hp = gameJS.characters[gameJS.turn].maxHP;
    }
    else{
      gameJS.characters[gameJS.turn].hp = newHealth;
    }
    gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" just used heal");
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
    if (armor == "none"){
      return 10+dexMod;
    }
    else if (armor == "leather"){
      return 11+dexMod;
    }
    else if (armor == "studdedleather"){
      return 12+dexMod;
    }
    else if (armor == "chainshirt"){
      return 13+(Math.min(dexMod,2));//Dex mod or 2 which ever is lower (gives you max dex of 2)
    }
  },

  //game mechanics
  getPlayerLoc: function(){//check the location of all of the characters
    for (var i = 0; i < gameJS.characters.length;i++){
      if (gameJS.characters[i].type == "player"){
        return [gameJS.characters[i].locX,gameJS.characters[i].locY];
      }
    }
  },

  nextTurn: function(){//reset turn actions with charcters numbers
    gameJS.turnMov = gameJS.characters[gameJS.turn].range;
    gameJS.turnAttks = gameJS.characters[gameJS.turn].attks;
    gameJS.turnSpecial = gameJS.characters[gameJS.turn].special;
    gameJS.turnActions = 1;
    gameJS.updateMsg("New Turn -> "+gameJS.characters[gameJS.turn].name);
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
    else if (ai == "guard"){
      gameJS.guardAI();
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
    if(gameJS.end){//check if endGame
      if (option == "win"){
        document.body.innerHTML = gameJS.winMsg;//allow custom message
      }
    }
    else{
      setTimeout(gameJS.nextTurn,500);//give deleteDead time to work.
    }
  },

  move: function(dir1){
    var newX = gameJS.characters[gameJS.turn].locX;
    var newY = gameJS.characters[gameJS.turn].locY;
    var move = 2;//0 = not enough, 1/1.5 = dist, 2 = try

    //diagonal moves 1.5
    if (dir1 == "ne"){
      newY = gameJS.characters[gameJS.turn].locY - 1;
      newX = gameJS.characters[gameJS.turn].locX + 1;
      move = 1.5;
    }
    else if (dir1 == "se"){
      newY = gameJS.characters[gameJS.turn].locY + 1;
      newX = gameJS.characters[gameJS.turn].locX + 1;
      move = 1.5;
    }
    else if (dir1 == "sw"){
      newY = gameJS.characters[gameJS.turn].locY + 1;
      newX = gameJS.characters[gameJS.turn].locX - 1;
      move = 1.5;
    }
    else if (dir1 == "nw"){
      newY = gameJS.characters[gameJS.turn].locY - 1;
      newX = gameJS.characters[gameJS.turn].locX - 1;
      move = 1.5;
    }
    //straight moves 1
    if (dir1 == "n"){
      newY = gameJS.characters[gameJS.turn].locY - 1;
      move = 1;
    }
    else if (dir1 == "s"){
      newY = gameJS.characters[gameJS.turn].locY + 1;
      move = 1;
    }
    else if (dir1 == "w"){
      newX = gameJS.characters[gameJS.turn].locX - 1;
      move = 1;
    }
    else if (dir1 == "e"){
      newX = gameJS.characters[gameJS.turn].locX + 1;
      move = 1;
    }
    //check if can move, lower move to zero to stop movement
    if (gameJS.turnMov  < 1.5 && (dir1 == "nw" || dir1 == "sw" || dir1 == "ne" || dir1 == "se")){
      move = 0;
    }
    else if (gameJS.turnMov  < 1 && (dir1 == "n" || dir1 == "w" || dir1 == "e" || dir1 == "s")){
      move = 0;
    }


    // move check attack up here
    var canNotAttack = gameJS.checkMovt4Attk(newX, newY,false);//false means you can attack (there was an attack or could attack if not out of attacks)
    if ((move == 1 || move == 1.5) && canNotAttack){
      console.log("Checking move of "+gameJS.characters[gameJS.turn].name+" to location "+newX+","+newY)
      if (gameJS.checkBlock(newX, newY, canNotAttack)){
        gameJS.turnMov = gameJS.turnMov - move;
        console.log(gameJS.characters[gameJS.turn].name+" movement is "+gameJS.turnMov);
        gameJS.updateMsg("none");
      }
    }
    else if (move == 0){
      console.log(gameJS.characters[gameJS.turn].name+" is out of movement");
      gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" is out of movement");
    }
  },

  checkBlock: function(dirX, dirY, move){
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
      if (locEl.classList.contains("exit") && move == true){//reached the exit but don't move if attk
        gameJS.checkEndState("exit");
      }
      else if (locEl.classList.contains("door") && move == true){//check if door, then if have key...
        var classNames = locEl.className.split(' ');
        var name = classNames[2];
        var num = name.slice(-1);
        if (gameJS.characters[gameJS.turn].items.includes("key"+num)){
          gameJS.unhide(num);//unhide
          locEl.classList.remove("door");//open door
          //remove key?
          gameJS.completeMove(dirX, dirY);
          locEl.className += " none";
          return true;//moved
        }

      }
      else if (locEl.classList.contains("key") && move == true && gameJS.characters[gameJS.turn].type != "monster"){//check if a key, don't go if monster...
        gameJS.getKey(locEl, dirX, dirY);
        return true;//moved
      }
      else if ((locEl.classList.contains("item")) && move == true && gameJS.characters[gameJS.turn].type != "monster"){//check if a key, don't go if monster...
        gameJS.getPotion(locEl, dirX, dirY);
        return true;//moved
      }
      else if (locEl.classList.contains("none") && move == true){//might have trouble if it is an item on ground//if wall no move and not out of bounds
        gameJS.completeMove(dirX, dirY)
        return true;//moved
      }
    }
  },

  getKey: function(locEl, dirX, dirY){
    //This is needed as the class locations change if hidden
    var hasKey = (element) => element == "key";//build equation to check where key is

    var classNames = locEl.className.split(' ');
    var name = classNames[classNames.findIndex(hasKey)+1];
    gameJS.characters[gameJS.turn].items.push(name);
    locEl.classList.remove("key");
    locEl.classList.remove("item");
    locEl.className += " none";
    gameJS.completeMove(dirX, dirY);
    console.log(gameJS.characters[gameJS.turn].items);
    gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" picked up "+name);
  },

  getPotion: function(locEl, dirX, dirY){
    var classNames = locEl.className.split(' ');
    var hasItem = (element) => element == "item";
    var name = classNames[classNames.findIndex(hasItem)+1];
    if (name.includes("heal")){
      var dice = "1d"+name.slice(-1);
      gameJS.heal(0,dice);
    }
    else if (name.includes("spec")){
      if (name == "spec1"){gameJS.characters[gameJS.turn].special1times += 1;}
      document.getElementById("spec1times").innerHTML = gameJS.characters[gameJS.turn].special1times;
    }

    locEl.classList.remove("item");
    locEl.className += " none";
    gameJS.completeMove(dirX, dirY);
    console.log(gameJS.characters[gameJS.turn].items);
    gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" picked up "+name);
  },

  completeMove: function(dirX, dirY){
    gameJS.removePic(gameJS.characters[gameJS.turn].locX,gameJS.characters[gameJS.turn].locY);
    gameJS.characters[gameJS.turn].locX = dirX;
    gameJS.characters[gameJS.turn].locY = dirY;
    gameJS.placeCharacter(gameJS.characters[gameJS.turn]);
  },

  unhide: function(num){
    var hidEl = document.getElementsByClassName("hide"+num);
    console.log("hide"+num);
    for (var i = 0;i < hidEl.length;i++){
      hidEl[i].style.visibility = "visible";
      hidEl[i].className += " none";
    }
  },

  checkMovt4Attk: function(dirX, dirY, aiAttk){//check to see if movement is an attack
    for (var i = 0; i < gameJS.characters.length;i++){
      if (gameJS.characters[i].name != gameJS.characters[gameJS.turn].name && (gameJS.characters[i].locX == dirX && gameJS.characters[i].locY == dirY)){//if not smae charcter and enemy there
        var okToAttk = gameJS.checkOpponentType(gameJS.characters[gameJS.turn],gameJS.characters[i]);//check type (so monsters don't attack monsters)
        //if no attacks
        if (gameJS.turnAttks < 1){
          console.log(gameJS.characters[gameJS.turn].name+" has no Attacks left");
          gameJS.updateMsg(gameJS.characters[gameJS.turn].name+" has no Attacks left");
        }
        else if (!okToAttk){
          if (aiAttk) {return true;}//didn't attack, try next
          else {return false;}//not ai attack don't move
          console.log(gameJS.characters[gameJS.turn].name+" is trying to attack "+gameJS.characters[i]);
        }
        else if (okToAttk){
          //minus attack
          gameJS.turnAttks = gameJS.turnAttks - 1;
          //create attack
          var attkBonus = 0;//extra to hit
          var attk = gameJS.characters[gameJS.turn].attkBonus;//this is extra damage and used to calculate hit
          var hit = attk+gameJS.characters[gameJS.turn].prof;
          var dmg = gameJS.playerAttack(gameJS.characters[gameJS.turn].attk,hit,attkBonus,attk,gameJS.characters[i].armorClass);
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
            gameJS.updateMsg(gameJS.characters[i].name+" takes "+dmg+" damage");
          }
        }
        return false;//attacked (or something is there to attk), don't move
      }
    }
    return true;//didn't attack, go ahead and try to move
  },

  checkOpponentType: function(attk,defend){
    if (attk.type == "monster" && defend.type == "monster"){
      return false;
      console.log("Monster tried to attack and other monster");
    }
    else if (attk.type == "npc" && defend.type == "player"){//add if hostile to player feature later
      return false;
    }
    return true;
  },

  setEndState:function(goal){
    gameJS.endState = goal;
  },
  checkEndState: function(info){
    if (gameJS.endState == "death" || gameJS.endState == "either"){//if goal kill enemy check if all dead
      if (gameJS.characters.length - gameJS.turnDeath.length == 1){
        gameJS.end = true;
        gameJS.endTurn("win");
      }
    }
    if(gameJS.endState == "exit" || gameJS.endState == "either") {//if goal home check if they are at end block
      if (info == "exit"){
        gameJS.end = true;
        gameJS.endTurn("win");
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
    gameJS.removePic(character.locX,character.locY);//move them off map until they can be removed at the end of the turn
    character.locX = 0;
    character.locY = 0;
    if (character.type != "monster"){//will need mod for npc and or multiplayer
      document.body.innerHTML = '<h1 style="text-align:center;">You done died</h1><h2 style="text-align:center;">Please refresh the page to try again</h2>';
      gameJS.endTurn("gameover");
    }
    else{
      gameJS.turnDeath.push(character);
      console.log(gameJS.turnDeath);
      gameJS.checkEndState();
    }
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
    var extra = 0;
    var special = false;//used special?
    if (gameJS.characters[gameJS.turn].offhand == "dagger"){//get offhand damage
      extra += gameJS.rollDice("1d4");//can do getWeaponDamage()
      console.log("Offhand damage = " + extra);
    }
    if (gameJS.turnIsSpecialAttk[0]){
      extra += gameJS.rollDice(gameJS.turnIsSpecialAttk[1]);//should pull the special from class
      console.log("Special damage (including offhand) = " + extra);
      gameJS.turnIsSpecialAttk[0] = false;
      special = true;
    }
    if (roll + hit1 + attkBonus1 > enemyAC1){
      return gameJS.rollDice(attk1)+ dmgBonus1 + extra;
    }
    else {
      if (special){//return sneak attack on miss
        if (gameJS.turnIsSpecialAttk[2] == 1){
          gameJS.characters[gameJS.turn].special1times += 1;
          document.getElementById("spec1times").innerHTML = gameJS.characters[gameJS.turn].special1times;
        }
        else if (gameJS.turnIsSpecialAttk[2] == 2){
          gameJS.characters[gameJS.turn].special2times += 1;
          document.getElementById("spec2times").innerHTML = gameJS.characters[gameJS.turn].special2times;
        }
      }
      return 0;
    }
  },

  didAttack: function(){
    var newX = gameJS.characters[gameJS.turn].locX;
    var newY = gameJS.characters[gameJS.turn].locY;

    if (!gameJS.checkMovt4Attk(newX+1,newY-1,true)){//attacked ne
      console.log("Attacked player at NE");
      return true;
    }
    else if (!gameJS.checkMovt4Attk(newX+1,newY+1,true)){//attacked se
      console.log("Attacked player at SE");
      return true;
    }
    else if (!gameJS.checkMovt4Attk(newX-1,newY+1,true)){//attacked sw
      console.log("Attacked player at SW");
      return true;
    }
    else if (!gameJS.checkMovt4Attk(newX-1,newY-1,true)){//attacked nw
      console.log("Attacked player at NW");
      return true;
    }
    else if (!gameJS.checkMovt4Attk(newX,newY-1,true)){//attacked n
      console.log("Attacked player at N");
      return true;
    }
    else if (!gameJS.checkMovt4Attk(newX,newY+1,true)){//attacked s
      console.log("Attacked player at S");
      return true;
    }
    else if (!gameJS.checkMovt4Attk(newX-1,newY,true)){//attacked w
      console.log("Attacked player at W");
      return true;
    }
    else if (!gameJS.checkMovt4Attk(newX+1,newY,true)){//attacked e
      console.log("Attacked player at E");
      return true;
    }
    console.log("No Player to attack");
    return false;
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
  dumbAI: function(){//check if attack, attack, else move randomly
    var noAttk = false;//no attack left
    if (gameJS.didAttack()){
      if (gameJS.turnAttks <= 0){//check if attack left, end turn
        console.log("Dumb enemy out of attacks - turn is over")
        noAttk = true;
      }
      else{
        setTimeout(gameJS.dumbAI,gameJS.nonPlayerTime);
        gameJS.updateMsg("none");
      }
    }
    else {
      var dirs = ["n","nw","w","sw","s","se","e","ne"];
      //var dirs = ["n","w","s","e"];
      var dir = dirs[Math.floor(Math.random() * dirs.length)];;
      gameJS.move(dir);
    }
    //if not end of
    if (gameJS.turnMov < 1 || noAttk){
      console.log("Dumb enemy turn is over")
      gameJS.endTurn("enemy");
    }
    else{
      setTimeout(gameJS.dumbAI,gameJS.nonPlayerTime);
      gameJS.updateMsg("none");
    }
  },

  guardAI: function(){// sit in spot and attack nearby
    if (gameJS.didAttack()){
      if (gameJS.turnAttks <= 0){//check if attack left, end turn
        console.log("Guard enemy out of attacks - turn is over")
        gameJS.endTurn("enemy");
      }
      else{
        setTimeout(gameJS.guardAI,gameJS.nonPlayerTime);
        gameJS.updateMsg("none");
      }
    }
    else{
      gameJS.endTurn("enemy");
    }
  },

  simpleAI: function(){//move to enemy if can
    var noAttk = false;//no attack left
    var ogX = gameJS.characters[gameJS.turn].locX;
    var ogY = gameJS.characters[gameJS.turn].locY;
    if (gameJS.didAttack()){
      if (gameJS.turnAttks <= 0){//check if attack left, end turn
        console.log(" enemy out of attacks - turn is over")
        noAttk = true;
      }
      else{
        setTimeout(gameJS.simpleAI,gameJS.nonPlayerTime);
        gameJS.updateMsg("none");
      }
    }
    else{
      var playerLoc = gameJS.getPlayerLoc();
      console.log(playerLoc);
      if (playerLoc[0] > gameJS.characters[gameJS.turn].locX){//player X greater than enemy X
        gameJS.move("e");
      }
      if (playerLoc[0] < gameJS.characters[gameJS.turn].locX){//player X greater than enemy X
        gameJS.move("w");
      }
      if (playerLoc[1] > gameJS.characters[gameJS.turn].locY){//player X greater than enemy X
        gameJS.move("s");
      }
      if (playerLoc[1] < gameJS.characters[gameJS.turn].locY){//player X greater than enemy X
        gameJS.move("n");
      }
    }
    if (gameJS.turnMov < 1 || noAttk || (ogX == gameJS.characters[gameJS.turn].locX && ogY == gameJS.characters[gameJS.turn].locY)){// no movement, no attacks, didn't move
      console.log("Simple enemy turn is over")
      gameJS.endTurn("enemy");
    }
    else{
      setTimeout(gameJS.simpleAI,gameJS.nonPlayerTime);
      gameJS.updateMsg("none");
    }
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
var goblin =  new gameJS.character("Goblin",0,0,4,"leather","dagger","none",4,"goblin.png",10,14,12,8,8,6,"thief",1,"dumb","monster"); //goblin.locY = 0;
var fireStoker = new gameJS.character("FireStoker",0,0,6,"studdedleather","dagger","dagger",5,"fireStoker.png",14,10,14,9,8,8,"fighter",1,"simple","monster");
var demon = new gameJS.character("Demon",0,0,60,"chainshirt","longsword","dagger",8,"demon.png",18,12,16,12,14,13,"fighter",5,"guard","monster");
//how to create a pregen character
//var goblin2 = Object.create(goblin);//copy all goblin stats
//goblin2.name = "Goblin2";//rename
//goblin2.locY = 4;//change y location
//goblin2.locX - 5;//change x location
