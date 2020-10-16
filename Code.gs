function process() {
  var cntMonster = 1;
  var cntY = 1;
  var destination = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = destination.getSheetByName("Sample");
  var range = sheet.getRange("C2:Z100");
  
  
  var range2 = sheet.getRange("B2:B4");
  var cell2 = range2.getCell(1,1);
  var x = cell2.getValue();
  var cell3 = range2.getCell(2,1);
  var y = cell3.getValue();
  var cell3 = range2.getCell(3,1);
  var color = cell3.getValue();
  if (color == "lightgray"){color = "gainsboro";}
  
  var board = "gameJS.createBoard("+x+","+y+",[";
  var badDudes = "";
  
  for(var i = 0;i < y; i++){
    for(var j = 0; j < x;j++){
      var cell = range.getCell(i+1,j+1);
      var content = cell.getValue();
      //check for blocks
      if (content == "x"){
        board += '"black,blocked"';
      }
      else if (content == "s"){
        board += '"blue,home"';
      }
      else if (content == "d"){
        board += '"gray,door"';
      }
      else if (content == "h"){
        board += '"white,hidden"';
      }
      else{
        board += '"'+color+',none"';
      }
      //check for monsters
      if (content == "g"){
        badDudes += 'var goblin'+cntMonster+' = Object.create(goblin);goblin'+cntMonster+'.name = "Goblin'+cntMonster+'";goblin'+cntMonster+'.locY = '+(i+1)+';goblin'+cntMonster+'.locX = '+(j+1)+';';
        cntMonster++;
      }
      if (j != x-1 || i != y-1){
        board += ",";
      }
    }
  }
  board += "]);"+badDudes;
  var range5 = sheet.getRange("A1:A1");
  var cell5 = range5.getCell(1,1);
  cell5.setValue(board);
}

function createChar() {
  var cntMonster = 1;
  var destination = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = destination.getSheetByName("CharacterCreator");  
  
  var range2 = sheet.getRange("B2:B17");
  var name = range2.getCell(1,1).getValue();
  var yLoc = range2.getCell(2,1).getValue();
  var xLoc = range2.getCell(3,1).getValue();
  var hp = range2.getCell(4,1).getValue();
  var armor = range2.getCell(5,1).getValue();
  var wep = range2.getCell(6,1).getValue();
  var range = range2.getCell(7,1).getValue();
  var img = range2.getCell(8,1).getValue();
  var str = range2.getCell(9,1).getValue();
  var dex = range2.getCell(10,1).getValue();
  var con = range2.getCell(11,1).getValue();
  var wis = range2.getCell(12,1).getValue();
  var int = range2.getCell(13,1).getValue();
  var cha = range2.getCell(14,1).getValue();
  var charClass = range2.getCell(15,1).getValue();
  var lvl = range2.getCell(16,1).getValue();
  
  var char = 'var '+name.toLowerCase()+' = new gameJS.character("'+name+'",'+yLoc+','+xLoc+','+hp+',"'+armor+'","'+wep+'",'+range+',"'+img+'",'+str+','+dex+','+con+','+wis+','+int+','+cha+',"'+charClass+'",'+lvl+');';
  
  var range5 = sheet.getRange("A1:A1");
  var cell5 = range5.getCell(1,1);
  cell5.setValue(char);
}
