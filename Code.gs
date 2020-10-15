function process() {
  var cntX = 1;
  var cntY = 1;
  var destination = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = destination.getSheetByName("Sample");
  var range = sheet.getRange("C2:Z100");
  
  
  var range2 = sheet.getRange("B2:B3");
  var cell2 = range2.getCell(1,1);
  var x = cell2.getValue();
  var cell3 = range2.getCell(2,1);
  var y = cell3.getValue();
  
  var board = "gameJS.createBoard("+x+","+y+",[";
  var badDudes = "";
  
  for(var i = 0;i < y; i++){
    for(var j = 0; j < x;j++){
      var cell = range.getCell(i+1,j+1);
      var content = cell.getValue();
      if (content == "x"){
        board += '"black,blocked"';
      }
      else if (content == "h"){
        board += '"blue,home"';
      }
      else{
        board += '"gray,none"';
      }
      if (j != x-1 || i != y-1){
        board += ',';
      }
    }
  }
  board += "]);";
  var range5 = sheet.getRange("A1:A1");
  var cell5 = range5.getCell(1,1);
  cell5.setValue(board);
}
