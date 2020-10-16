var gameJS = {
  widthS: 30,//width of square in pixels
  heightS: 30,//height of square in pixels
  characters: [],
  boardColor: "gainsboro",


  //create game board
  createBoard : function(h,w, boardOptions1){
    //this.widthS gets the pixel width of each block (square)
    var boardEl = document.getElementById("gameBoard");
    var opts = 0;
    if (boardOptions1){
      //know that there are options
    }

    for (var i = 0; i < h; i++){
      var rowEl = document.createElement("div");
      rowEl.className = "row";
      rowEl.style.display = "flex";
      rowEl.id = "row"+(1+i);
      for (var j = 0; j < w; j++){
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
  createLegend: function(){
    var legEl = document.getElementById("legend");
    legEl.innerHTML = "";
  },
  //
  createArrrows: function() {
    var arEl = document.getElementById("gamepad");
    arEl.innerHTML = "";
  },


  //player monster npc stats
  character: function(name1, locY1, locX1, hp1, armor1, weapon1, range1, img1, str1, dex1, con1, wis1, int1, cha1, charClass1, lvl1){
    this.name = name1;
    this.locY = locY1;
    this.locX = locX1;
    this.hp = hp1;
    this.armorClass = gameJS.getArmorClass(armor1,dex1);
    this.armor = armor1;
    this.attk = gameJS.getWeaponDamage(weapon1);
    this.weapon = weapon1;
    this.attkBonus = "";
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
  },

  //classes "special,times,special2,time,hp,statbonus"
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
  nextTurn: function(){

  },
  move: function(dir1){

  },
  rollInitiative: function(characters){//roll for all characters then reset their order
    for (var i = 0; i < characters.length;i++){
      var dexMod = gameJS.getProfBonus(characters[i].dex);
      characters[i].initiative = gameJS.rollDice("1d20")+dexMod;
    }
    characters.sort((a,b) => (a.initiative < b.initiative) ? 1 : ((b.initiative < a.initiative) ? -1 : 0));
    gameJS.characters =  characters;
  },
  death: function(){//if character is < 0 they die remove from list and board

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
    //show arrows

    //add event listeners
  },


  //rules
  getProfBonus: function(prof){//send stat and then return the prof bonus.
    return Math.floor((prof-10)/2);
  },
  playerAttack: function(attk1, hit1, attkBonus1, dmgBonus1, enemyAC1){
    var roll = gameJS.rollDice("1d20");
    if (roll + hit1 + attkBonus1s > enemyAC1){
      return rollDice+dmgBonus1;
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
    return total; //total roll
  },

  //AI


  //multiroom
  teleport: function(){

  },
};
//pregen enemies
var goblin =  new gameJS.character("Goblin",0,0,4,"leather","dagger",4,"goblin.png",10,14,12,8,8,6,"monster",1); //goblin.locY = 0;


//how to create a pregen character
//var goblin2 = Object.create(goblin);//copy all goblin stats
//goblin2.name = "Goblin2";//rename
//goblin2.locY = 4;//change y location
//goblin2.locX - 5;//change x location

//How to create
//var myCharacter =  new gameJS.character("Steve",10,8,14,"1d8",4,"imgLoc");
