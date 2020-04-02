

function Cell(row, column, opened, flagged, mined, neighborMineCount){
    return{
        id: row+" "+column,
        opened:opened,
        flagged:flagged,
        mined:mined,
        neighborMineCount:neighborMineCount
    }
}



function getRandomInteger(min,max){
    return Math.floor( Math.random() * ( max - min ) ) + min;
}
function handlerightclick(id){
    let cell = board[id];
    if(!gameover){
        if(!cell.opened){
            if(!cell.flagged && minesRemaining>0){
                    cell.flagged = true;
                    $("#"+id).html( FLAG ).css( 'color', 'red');
                    minesRemaining--;
                    
            }else if(cell.flagged){
                cell.flagged=false;
                $("#"+id).html( "" ).css( 'color', 'black');
                minesRemaining++;
            }
        }
        $( '#mines-remaining').text( minesRemaining );

    }
}



function loss(){
    gameover = true;
    $('#messageBox').text('Game Over!')
                .css({'color':'white', 
                        'background-color': 'red'});
    for(let row=0;row<boardSize;row++){
        for(let col=0;col<boardSize;col++){
            if(board[row+""+col].mined && !board[row+""+col].flagged){
                $('#'+row+""+col).html( MINE ).css('color', 'green');
            }
        }
    }
}

function handleclick(id){
    var cell = board[id]; 
    if(!gameover){
        if(!cell.opened){
            if(!cell.flagged){
                if(cell.mined){
                    loss(id);
                }else{
                    cell.opened = true;
                    if(cell.neighborMineCount>0){
                        $("#"+id).html( "" ).css( 'background-image', 'radial-gradient(#FFFFFF,#FFFFFF)');
                        if(cell.neighborMineCount==1){
                            $("#"+id).text(cell.neighborMineCount).css('color','red');
                        }else if(cell.neighborMineCount==2){
                            $("#"+id).text(cell.neighborMineCount).css('color','blue');

                        }else{
                            $("#"+id).text(cell.neighborMineCount);
                        }
                    }else{  
                        $("#"+id).html( "" )
                                    .css( 'background-image', 'radial-gradient(#FFFFFF,#FFFFFF)');
    
                        var neighbors = getNeighbors(id);
                        for(var i=0;i<neighbors.length;i++){
                            neighbor = neighbors[i];
                            if(typeof board[neighbor] !== 'undefined' &&
                            !board[neighbor].flagged && !board[neighbor].opened){
                                handleclick( neighbor );
                            }
                        }
                    }
                }
            }
        }
    }
    
}


function initializeCells( boardSize ) {
    var column = 0;
    var r = 0;
    $( ".cell" ).each( function(){
        $(this).attr( "id", r + "" + column ).css('color', 'black').text("");
        $('#' + r + "" + column ).css('background-image', 
                                        'radial-gradient(#A9A9A9,#A9A9A9)');
        column++;
        if( column >= boardSize )
        {
            column = 0;
            r++;
        };
        $(this).off().click(function(e){
            handleclick(e.target.id);
            let closedcell = 0;
            for(let row=0;row<boardSize;row++){
                for(let col=0;col<boardSize;col++){
                    if(!board[row+""+col].opened){
                        closedcell++;
                    }
                }
            }
            console.log(closedcell);            
            if(closedcell == mines){
                gameOver = true;
				$('#messageBox').text('You Win!').css({'color': 'white',
													   'background-color': 'green'});
            }
            
        });
        $(this).contextmenu(function(e){
            handlerightclick(e.target.id );
            return false;
        })
        
        
    })
        
}

function randomlyAssignMines(board,minecount){
    let numberofmines = 0
    while(minecount>numberofmines){
        const randomRowCoordinate = getRandomInteger( 0, boardSize );
        const randomColumnCoordinate = getRandomInteger( 0, boardSize );
        const cell = board[randomRowCoordinate+""+randomColumnCoordinate];

        if(!cell.mined){
            cell.mined = true;
            numberofmines++;
        }

    }
    return board;
}
function calculateNeighborMineCounts(board,boardSize){
    let minecount = 0;
    for(var i=0;i<boardSize;i++){
        for(var j=0;j<boardSize;j++){
            var id = i + "" + j;    
            if(!board[id].mined){
                const neighbors = getNeighbors( id );
                minecount = 0;
                for(let i=0;i<neighbors.length;i++){                      
                    minecount+=isMined( board, neighbors[i] );                        
                }
                board[id].neighborMineCount = minecount
            }
        }
    }
    return board;        
}
var isMined = function( board, id ){	
    var cell = board[id];
    var mined = 0;
    if( typeof cell !== 'undefined' ){
        mined = cell.mined ? 1 : 0;
    }
    return mined;
}


function getNeighbors(id){
    const neighbors = [];
    const row = parseInt(id[0]);
    const column = parseInt(id[1]);
    neighbors.push( (row - 1) + "" + (column - 1) );
    neighbors.push( (row - 1) + "" + column );
    neighbors.push( (row - 1) + "" + (column + 1) );
    neighbors.push( row + "" + (column - 1) );
    neighbors.push( row + "" + (column + 1) );
    neighbors.push( (row + 1) + "" + (column - 1) );
    neighbors.push( (row + 1) + "" + column );
    neighbors.push( (row + 1) + "" + (column + 1) );
    for(let n = 0;n<neighbors.length;n++){
        if(neighbors[n].length>2){
            neighbors.splice(n,1);
            n--;
        }
    }
    return neighbors

}

function Board(boardSize,minecount){
    let board = {}
    for(var row = 0;row<boardSize;row++){
        for(var col=0;col<boardSize;col++){
            board[row + "" + col] = Cell(row,col,false,false,false,0)
        }
    }
    board = randomlyAssignMines( board, minecount );
    board = calculateNeighborMineCounts( board, boardSize );
    
    return board;
}


function start(){    
    clearInterval(initial);

    initializeCells(boardSize);
    board = Board(boardSize,mines);
    stdate = Date.now();

    initial = setInterval(function() {
        $('#time').text((new Date - stdate) / 1000 + " Seconds");
    }, 1000);
    return board;
    
}
var FLAG = "&#9873;";
var MINE = "&#9881;";
var boardSize = 10;
var mines = 10;

var minesRemaining=mines;
gameover = false;
let stdate=0;
var board = start();

var initial;

$('#new-game-button').click( function(){
    gameover = false;
    $('#messageBox').text('Make a Move!')
    .css({'color': 'rgb(255, 255, 153)', 
          'background-color': 'rgb(102, 178, 255)'});
    minesRemaining = mines;
    board = start();
    
})







