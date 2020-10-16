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
        colEl.className = "row";
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


  //player monster npc stats
  character: function(name1, locY1, locX1, hp1, armor1, weapon1, range1, img1, str1, dex1, con1, wis1, int1, cha1, charClass1, lvl1){
    this.name = name1;
    this.locY = locY1;
    this.locX = locX1;
    this.hp = hp1;
    this.armorClass = gameJS.getArmorClass(armor1,dex1);
    this.armor = armor1;
    this.attk = gameJS.getWeaponDamage(weapon1);
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
  },

  //classes
  classAbility: function(cls1, lvl1){
    if (lvl1 == 1){
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
    var num = parts[0];
    var type = parts[1];
    var total = 0;
    for (var i = 0;i < num;i++){
      total += Math.floor(Math.random() * type) + 1;
    }
    return total; //total roll
  },


};
