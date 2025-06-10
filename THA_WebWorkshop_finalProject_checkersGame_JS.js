console.log("current edited version");
// console.log("located in : " + __filename);
const currentTime = new Date();

// Get the current time components
const currentYear = currentTime.getFullYear();
const currentMonth = currentTime.getMonth();
const currentMonthDay = currentTime.getDate();
const currentWeekDay = () => {
    const weekDays = ['Monday' , 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return weekDays[currentTime.getDay()];
}
const currentHour = currentTime.getHours();
const currentMinutes = currentTime.getMinutes();
const currentSeconds = currentTime.getSeconds();

// Format the date as 'YYYY.MM.DD - weekDayName'
const formattedDate = `${currentYear}.${currentMonth}.${currentMonthDay} - ${currentWeekDay()}`;

// Format the hour as 'HH:MM:SS'
const formattedHour = `${currentHour}:${currentMinutes}:${currentSeconds}`;

const formattedTime = `
    ${formattedDate}
    ${formattedHour}
    `;

// Log the current time to the console
console.log(`run on the time : ${formattedTime}`);





class basicPopMessage{
    
    contaningElement;
    popMessageTypeName;
    screen;
    box;
    textArea;
    buttonsArea;

    constructor( popMessageTypeName ){

        this.contaningElement = null;

        this.popMessageTypeName = ( popMessageTypeName === null || popMessageTypeName === undefined ) ? '' : popMessageTypeName;
        this.popMessageTypeName = this.popMessageTypeName === '' ? 'basic-pop-message' : popMessageTypeName + '-pop-message';

        const basicPopMessageComponentsDictionary = {
            'screen':'screen',
            'box':'box',
            'text-area':'textArea',
            'buttons-area':'buttonsArea'
        };   
        
        for (const componentKeyName of Object.keys(basicPopMessageComponentsDictionary)) {
            const componentPropertyName = basicPopMessageComponentsDictionary[componentKeyName];
            this[componentPropertyName] = document.createElement('div');
            this[componentPropertyName].setAttribute('id', `${this.popMessageTypeName}-${componentKeyName}`);
            if (componentKeyName !== 'screen') {
                this[componentPropertyName].classList.add('woodenPanel');
            }
            this[componentPropertyName].classList.add(`pop-message-${componentKeyName}`);
        }

        this.textArea.innerText = 'POP UP MESSAGE TEMPLATE - FOR DEMO PURPOSS ONLY\nReplace using setMessageText() method';
    }

    getPopMessageAsCompositeElement(){
        this.box.appendChild(this.textArea);
        this.box.appendChild(this.buttonsArea);
        this.screen.appendChild(this.box);
        return this.screen;
    }

    setPopMessageText( textForMessage ){
        this.textArea.innerText = textForMessage;
        this.textArea.classList.add('pop-message-text-area');
    }

    addButtonToButtonsArea( buttonTypeFieldName, buttonTypeIdName , textToAppearOnButton ){
        this[buttonTypeFieldName] = document.createElement('button');
        this[buttonTypeFieldName].setAttribute('id', `${this.popMessageTypeName}-${buttonTypeIdName}`);
        this[buttonTypeFieldName].classList.add('woodenPanel',`pop-message-button`);
        this[buttonTypeFieldName].innerText = textToAppearOnButton;
        this[buttonTypeFieldName].addEventListener('click' , () => {this.clearPopMessage();} );

        this.buttonsArea.appendChild(this[buttonTypeFieldName]);

    }

    showPopMessageOnElement( elementId ){
        this.contaningElement = document.getElementById( elementId );
        this.contaningElement.appendChild(this.getPopMessageAsCompositeElement());
    }

    clearPopMessage(){
        if (this.contaningElement != null ) {
            this.contaningElement.removeChild(this.getPopMessageAsCompositeElement());
            this.contaningElement = null;
        }
    }

}



class alertPopMessage extends basicPopMessage{

    acceptButton;

    constructor( alertPopMessageText ){
        super('alert');

        this.addButtonToButtonsArea('acceptButton','accept-button','OK');
        
        this.setPopMessageText( alertPopMessageText );
    }

    modifyAcceptButtonFunctionality( functionToRunOnAcceptClick ){
        this.acceptButton.addEventListener('click', functionToRunOnAcceptClick );
    }

}



class confirmPopMessage extends basicPopMessage{

    acceptButton;
    rejectButton;
    isUserAccepting = false;

    constructor( confirmPopMessageText ){
        super('confirm');

        this.addButtonToButtonsArea('acceptButton','accept-button','Yes');
        this.addButtonToButtonsArea('rejectButton','reject-button','No');
        
        this.acceptButton.addEventListener('click', () => {this.isUserAccepting = true;} );

        this.setPopMessageText( confirmPopMessageText );
    }

    modifyAcceptButtonFunctionality( functionToRunOnAcceptClick ){
        this.acceptButton.addEventListener('click', functionToRunOnAcceptClick );
    }

    modifyRejectButtonFunctionality( functionToRunOnRejectClick ){
        this.rejectButton.addEventListener('click', functionToRunOnRejectClick );
    }

}



class Position{

    rowNum;
    columnNum;

    constructor( rowNum , columnNum ){
        this.rowNum = rowNum;
        this.columnNum = columnNum;
    }

    toString(){
        return `(${this.rowNum},${this.columnNum})`;
    }

    equalsTo( other ){
        return other !== null &&
            other instanceof(Position) &&
            this.rowNum === other.rowNum &&
            this.columnNum === other.columnNum;
    }

}



class Vector{

    startPosition; 
    endPosition;
    rowVectorComponent;
    columnVectorComponent;

    constructor( startPosition , endPosition ){
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.rowVectorComponent = this.endPosition.rowNum - this.startPosition.rowNum ;
        this.columnVectorComponent = this.endPosition.columnNum - this.startPosition.columnNum ;
    }
    
    toString(){
        return ` ${this.startPosition.toString()} => ${this.endPosition.toString()} `;
    }

    equalsTo( other ){
        return other !== null &&
            other instanceof(Vector) &&
            this.startPosition.equalsTo(other.startPosition) &&
            this.endPosition.equalsTo(other.endPosition);
    }

}

class Move extends Vector {

    constructor( startPosition , endPosition ){
        super( startPosition , endPosition);
    }

    allFieldsToString(){
        return
            `
            start square :  ${this.startPosition.toString()}
            end square :  ${this.endPosition.toString()}
            moveVector :  [${this.rowVectorComponent},${this.columnVectorComponent}]
            `
        ;
    }

    isDiagonal(){
        return Math.abs(this.rowVectorComponent) === Math.abs(this.columnVectorComponent);
    }

    listMovePathMidPositions(){
        let movePathMidPositions = [];
        if ( this.isDiagonal() && Math.abs(this.rowVectorComponent) > 0 ) {
            const rowVectorStep = ( this.rowVectorComponent / Math.abs(this.rowVectorComponent) ) ;
            const columnVectorStep = ( this.columnVectorComponent/Math.abs(this.columnVectorComponent) ) ;
            for (
                let row = this.startPosition.rowNum + rowVectorStep , column = this.startPosition.columnNum  + columnVectorStep; 
                row !== this.endPosition.rowNum && column !== this.endPosition.columnNum ;
                row += rowVectorStep, column += columnVectorStep
                ) 
            {
                movePathMidPositions.push( new Position(row,column));
            }
        }   
        return movePathMidPositions;
    }

}

const boardSideLength = () => {
    return 8;
}



class Piece{

    isWhite;

    constructor( isWhite ){
        this.isWhite = isWhite;
    }

    toString(){
        return this.isWhite ? 'W' : 'B';
    }

}



class Man extends Piece{

    constructor(isWhite){
        super(isWhite);
    }

    toString(){
        return (super.toString() + 'M');
    }

}

class King extends Piece{

    constructor(isWhite){
        super(isWhite);
    }

    toString(){
        return super.toString() + 'K';
    }

}


class CheckersLogic{
    gameEnded;
    gameEndMessage;
    turnNum;
    whitePiecesLeft;
    blackPiecesLeft;
    positionOfPieceInCaptureSequence;
    positionsOfPiecesInBurnRisk = [];
    logicBoard;
    legalMovesForCurrentPlayer;

    constructor() {
        this.gameEnded = false;
        this.gameEndMessage = '';
        this.turnNum = 1;
        this.whitePiecesLeft = 12;
        this.blackPiecesLeft = 12;
        this.positionOfPieceInCaptureSequence = null;
        this.initLogicBoard();
        this.legalMovesForCurrentPlayer = this.listLegalMovesForCurrentPlayer();
    }

    isCurrentPlayerWhite(){
        return this.turnNum % 2 === 1;
    } 
    
    isCurrentOpponentWhite(){
        return this.turnNum % 2 === 0;
    } 
    
    currentPlayerToString(){
        return this.isCurrentPlayerWhite() ? "White" : "Black";
    }
    
    currentOpponentToString(){
        return this.isCurrentOpponentWhite() ? "White" : "Black";
    }

    initLogicBoard(){
        this.logicBoard = [];
        for (let row = 0; row < boardSideLength(); row++) {
            this.logicBoard.push([]);
            for (let column = 0; column < boardSideLength(); column++) {
                if (row < 3 && row % 2 !== column % 2) {
                    this.logicBoard[row].push(new Man(false) );
                }
                else if ( row > 4 && row % 2 !== column % 2){
                    this.logicBoard[row].push(new Man(true));
                }
                else
                    this.logicBoard[row].push(null);
            }
        }
    }

    logicBoardToString(){
        let logicBoardAsString = '\n\n';
        for (let row = 0; row < boardSideLength(); row++) {
            logicBoardAsString += '\t\t';
            for (let column = 0; column < boardSideLength(); column++) {
                if ( this.logicBoard[row][column] == null ) {
                    logicBoardAsString += '-- ';
                }
                else{
                    logicBoardAsString += this.logicBoard[row][column].toString() + ' ';
                }
            }
            logicBoardAsString += '\n';
        }
        logicBoardAsString += '\n';
        return logicBoardAsString;
    }

    isPositionClear( position ){
        return this.logicBoard[ position.rowNum ][ position.columnNum ] == null;
    }

    isPositionTakenByCurrentPlayer( position ){
        return !this.isPositionClear( position ) &&
            this.logicBoard[ position.rowNum ][ position.columnNum ].isWhite === this.isCurrentPlayerWhite();
    }

    isPositionTakenByCurrentOpponent( position ){
        return !this.isPositionClear( position ) &&
            this.logicBoard[ position.rowNum ][ position.columnNum ].isWhite === this.isCurrentOpponentWhite();
    }

    listTakenMidPositionsInMovePath( move ){
        let takenMidPositions = {
            byCurrentPlayer : [],
            byCurrentOpponent : []
        }
        if ( move.isDiagonal() ) {
            const midPositionsInMovePath = move.listMovePathMidPositions();
            for (const midPosition of midPositionsInMovePath) {
                if (this.isPositionTakenByCurrentPlayer(midPosition)) {
                    takenMidPositions.byCurrentPlayer.push(midPosition);
                }
                else if ( this.isPositionTakenByCurrentOpponent(midPosition)){
                    takenMidPositions.byCurrentOpponent.push(midPosition);
                }
            }
        }
        return takenMidPositions;
    }

    doesMoveEndInClearPosition( move ){
        return this.isPositionClear( move.endPosition );
    }

    areMidPositionsOfMovePathFreeOfCurrentPlayerPieces( move ){
        const takenMidPositions = this.listTakenMidPositionsInMovePath(move);
        return takenMidPositions.byCurrentPlayer.length === 0;
    }

    areMidPositionsOfMovePathFreeOfCurrentOpponentPieces( move ){
        const takenMidPositions = this.listTakenMidPositionsInMovePath(move);
        return takenMidPositions.byCurrentOpponent.length === 0;
    }

    isThereSingleOpponentPieceInMidPositionsOfMovePath( move ){
        const takenMidPositions = this.listTakenMidPositionsInMovePath(move);
        return takenMidPositions.byCurrentOpponent.length === 1;
    }

    isTherePieceInCaptureSequence(){
        return this.positionOfPieceInCaptureSequence != null;
    }

    isLegalStandardMoveDirectionForManPiece( move ){
        const selectedManPiece = this.logicBoard[ move.startPosition.rowNum ][ move.startPosition.columnNum ];
        if ( selectedManPiece == null ) {
            return false;
        }
        return ( selectedManPiece.isWhite && move.rowVectorComponent < 0 ) ||
            ( !selectedManPiece.isWhite && move.rowVectorComponent > 0 );
    }

    isLegalWalkDistanceForManPiece( move ){
        return ( Math.abs(move.rowVectorComponent) === 1 && Math.abs(move.columnVectorComponent) === 1 );
    }

    isLegalCaptureDistanceForManPiece( move ){
        return ( Math.abs(move.rowVectorComponent) === 2 && Math.abs(move.columnVectorComponent) === 2 );
    }

    doesMoveStartInSequentialCapturePosition(move){
        return move.startPosition.equalsTo(this.positionOfPieceInCaptureSequence);
    }

    doesMoveStartWithCurrentPlayerPiece( move ){
        return this.isPositionTakenByCurrentPlayer( move.startPosition );
    }

    doesMoveStartWithCurrentPlayerMan( move ){
        return this.doesMoveStartWithCurrentPlayerPiece( move ) && this.getPieceInPosition( move.startPosition ) instanceof(Man);
    }

    doesMoveStartWithCurrentPlayerKing( move ){
        return this.doesMoveStartWithCurrentPlayerPiece( move ) && this.getPieceInPosition( move.startPosition ) instanceof(King);
    }

    isLegalManWalkMove( move ){
        return !this.isTherePieceInCaptureSequence() &&
            this.doesMoveStartWithCurrentPlayerMan(move) && 
            this.doesMoveEndInClearPosition(move) &&
            move.isDiagonal() &&
            this.isLegalStandardMoveDirectionForManPiece(move) &&
            this.isLegalWalkDistanceForManPiece(move) &&
            this.areMidPositionsOfMovePathFreeOfCurrentPlayerPieces( move );
    }

    isLegalManStandardCaptureMove( move ){
        return !this.isTherePieceInCaptureSequence() &&
            this.doesMoveStartWithCurrentPlayerMan(move) && 
            this.doesMoveEndInClearPosition(move) &&
            move.isDiagonal() &&
            this.isLegalStandardMoveDirectionForManPiece(move) &&
            this.isLegalCaptureDistanceForManPiece(move) &&
            this.areMidPositionsOfMovePathFreeOfCurrentPlayerPieces( move ) &&
            this.isThereSingleOpponentPieceInMidPositionsOfMovePath( move );
    }

    isLegalManSequentialCaptureMove( move ){
        return this.isTherePieceInCaptureSequence() &&
            this.doesMoveStartInSequentialCapturePosition(move) &&
            this.doesMoveStartWithCurrentPlayerMan(move) && 
            this.doesMoveEndInClearPosition(move) &&
            move.isDiagonal() &&
            this.isLegalCaptureDistanceForManPiece(move) &&
            this.areMidPositionsOfMovePathFreeOfCurrentPlayerPieces( move ) &&
            this.isThereSingleOpponentPieceInMidPositionsOfMovePath( move );
    }

    getPieceInPosition(position){
        return this.logicBoard[ position.rowNum][position.columnNum ];
    }

    isLegalManMove(move){
        const isLegalManMove = this.isLegalManSequentialCaptureMove(move)||
            this.isLegalManStandardCaptureMove(move)||
            this.isLegalManWalkMove(move);
        return isLegalManMove;
    }

    isLegalKingWalkMove( move ){
        return !this.isTherePieceInCaptureSequence() &&
            this.doesMoveStartWithCurrentPlayerKing(move) && 
            this.doesMoveEndInClearPosition(move) &&
            move.isDiagonal() &&
            this.areMidPositionsOfMovePathFreeOfCurrentPlayerPieces( move ) &&
            this.areMidPositionsOfMovePathFreeOfCurrentOpponentPieces( move );
    }

    isLegalKingStandardCaptureMove( move ){
        return !this.isTherePieceInCaptureSequence() &&
            this.doesMoveStartWithCurrentPlayerKing(move) && 
            this.doesMoveEndInClearPosition(move) &&
            move.isDiagonal() &&
            this.areMidPositionsOfMovePathFreeOfCurrentPlayerPieces( move ) &&
            this.isThereSingleOpponentPieceInMidPositionsOfMovePath( move );
    }

    isLegalKingSequentialCaptureMove( move ){
        return this.isTherePieceInCaptureSequence() &&
            this.doesMoveStartInSequentialCapturePosition(move) &&
            this.doesMoveStartWithCurrentPlayerKing(move) && 
            this.doesMoveEndInClearPosition(move) &&
            move.isDiagonal() &&
            this.areMidPositionsOfMovePathFreeOfCurrentPlayerPieces( move ) &&
            this.isThereSingleOpponentPieceInMidPositionsOfMovePath( move );
    }

    isLegalKingMove(move){
        return this.isLegalKingSequentialCaptureMove(move)||
               this.isLegalKingStandardCaptureMove(move)||
               this.isLegalKingWalkMove(move);
    }

    isLegalWalkMove( move ){
        return this.isLegalManWalkMove(move) ||
            this.isLegalKingWalkMove(move);
    }

    isLegalCaptureMove( move ){
        return this.isLegalManStandardCaptureMove( move ) ||
            this.isLegalManSequentialCaptureMove( move ) ||
            this.isLegalKingStandardCaptureMove( move ) ||
            this.isLegalKingSequentialCaptureMove( move )
    }

    isLegalMove( move ){
        return this.isLegalCaptureMove(move) || this.isLegalWalkMove(move); 
    }

    isPromotionMove(move){
        const movedPiece = this.getPieceInPosition(move.startPosition);
        return ( movedPiece.isWhite && move.endPosition.rowNum === 0 ) || ( !movedPiece.isWhite && move.endPosition.rowNum === 7 );
    }

    movePiece( move ){
        this.logicBoard[ move.endPosition.rowNum ][ move.endPosition.columnNum ] = 
            this.logicBoard[ move.startPosition.rowNum ][ move.startPosition.columnNum ];
        this.logicBoard[ move.startPosition.rowNum ][ move.startPosition.columnNum ] = null;
    }

    capturePieceInPosition( position ){
        if ( this.isPositionTakenByCurrentOpponent(position) ){
            this.removePieceInPosition(position);
        }
    }

    promotePieceInPosition( position ){
        if ( !this.isPositionClear(position) ) {
            let pieceInPosition = this.logicBoard[ position.rowNum ][ position.columnNum ];
            if ( pieceInPosition instanceof Man ) {
                if ( pieceInPosition.isWhite && position.rowNum == 0 ) {
                    this.logicBoard[ position.rowNum ][ position.columnNum ] = new King(true);
                }
                else if ( !pieceInPosition.isWhite && position.rowNum == 7 ) {
                    this.logicBoard[ position.rowNum ][ position.columnNum ] = new King(false);
                }
            }
        }
    }

    listLegalCaptureMovesForPieceInPosition = ( piecePosition ) => {
        const pieceLegalCaptureMoves = [];
        for (let endPositionRow = 0; endPositionRow < boardSideLength(); endPositionRow++) {
            for (let endPositionColumn = 1; endPositionColumn < 8; endPositionColumn++) {
                let move = new Move(piecePosition, new Position(endPositionRow,endPositionColumn) );
                if ( this.isLegalCaptureMove(move) ) {
                    pieceLegalCaptureMoves.push(move);
                }
            }
        }
        return pieceLegalCaptureMoves;
    }

    doesPositionContainPieceInCaptureSequence(position){
        return this.positionOfPieceInCaptureSequence != null && this.positionOfPieceInCaptureSequence.equalsTo(position) ;
    }

    doesPositionContainPieceAtBurnRisk(position){
        return this.positionsOfPiecesInBurnRisk != [] &&
            -1 !== this.positionsOfPiecesInBurnRisk.findIndex( positionInBurnRisk => positionInBurnRisk.equalsTo(position) );
    }
    
    isMoveStartPositionAtBurnRisk(move){
        return this.doesPositionContainPieceAtBurnRisk(move.startPosition);
    }

    isMoveLegalForPieceInBurningPosition(move){
        return this.isMoveStartPositionAtBurnRisk(move) && this.isLegalCaptureMove(move);
    }

    

    listLegalMovesForCurrentPlayer(){
        let currentPlayerLegalMoves = [];
        for (let startPositionRow = 0; startPositionRow < boardSideLength(); startPositionRow++) {
            for (let startPositionColumn = 0; startPositionColumn < 8; startPositionColumn++) {
                for (let endPositionRow = 0; endPositionRow < boardSideLength(); endPositionRow++) {
                    for (let endPositionColumn = 0; endPositionColumn < 8; endPositionColumn++) {
                        const move = new Move(new Position(startPositionRow,startPositionColumn), new Position(endPositionRow,endPositionColumn) );
                        if ( this.isLegalMove(move) ) {
                            currentPlayerLegalMoves.push(move);
                            if ( this.isLegalCaptureMove(move) ) {
                                this.positionsOfPiecesInBurnRisk.push(move.startPosition);
                            }
                        }
                    }
                }
            }
        }
        currentPlayerLegalMoves = currentPlayerLegalMoves.filter( 
            legalMove => !this.isMoveStartPositionAtBurnRisk(legalMove) ||  this.isMoveLegalForPieceInBurningPosition(legalMove)
        );
        return currentPlayerLegalMoves;
    }

    removePieceInPosition( positionOfPiece ){
        const pieceInPosition = this.logicBoard[ positionOfPiece.rowNum ][ positionOfPiece.columnNum ];
        if (pieceInPosition != null) {
            if (pieceInPosition.isWhite) {
                this.whitePiecesLeft--;
            }
            else{
                this.blackPiecesLeft--;
            }
            this.logicBoard[ positionOfPiece.rowNum ][ positionOfPiece.columnNum ] = null;
        }
    }

    burnPieceInPosition( positionOfPiece ){
        this.removePieceInPosition( positionOfPiece );
    }

    applyMoveOnBoard( move ){
        const isLegalMove = this.isLegalMove(move);
        if ( isLegalMove ) {
            const isLegalCaptureMove = this.isLegalCaptureMove( move );
            const isPromotionMove = this.isPromotionMove( move );
            this.movePiece( move );
            if ( isPromotionMove ){
                this.promotePieceInPosition( move.endPosition );
            }
            if ( isLegalCaptureMove ){
                const takenMidPositions = this.listTakenMidPositionsInMovePath( move );
                this.capturePieceInPosition( takenMidPositions.byCurrentOpponent[0] );
                this.positionOfPieceInCaptureSequence = move.endPosition;
                const capturesLeftForCapturingPiece = this.listLegalCaptureMovesForPieceInPosition( move.endPosition );
                if ( capturesLeftForCapturingPiece.length === 0 ) {
                    this.positionOfPieceInCaptureSequence = null;
                }
            }
            else{
                for (const burnedPosition of this.positionsOfPiecesInBurnRisk ) {
                    this.burnPieceInPosition(burnedPosition);
                }
            }
            this.positionsOfPiecesInBurnRisk = [];
        }
    }

    gameStatusToString(){
        return `
            Game ended ? ${this.gameEnded}
            ${this.gameEnded ? ('Game end message : ' + this.gameEndMessage) : ''}
            ${this.currentPlayerToString()}'s turn
            White pieces left on board : ${this.whitePiecesLeft}
            Black pieces left on board : ${this.blackPiecesLeft}
            ${this.logicBoardToString()}
            `;
    }

    doesCurrentPlayerHaveNoPiecesLeft(){
        const piecesLeftForCurrentPlayer = this.isCurrentPlayerWhite() ? this.whitePiecesLeft : this.blackPiecesLeft;
        return piecesLeftForCurrentPlayer === 0;
    }

    doesCurrentPlayerHaveNoLegalMovesLeft(){
        return this.legalMovesForCurrentPlayer.length === 0;
    }

    updateGameEndStatus(){
        if ( this.doesCurrentPlayerHaveNoPiecesLeft() ) {
            this.gameEndMessage = `due to having no pieces left`;
        }
        else if ( this.doesCurrentPlayerHaveNoLegalMovesLeft() ){
            this.gameEndMessage = `due to having no legal moves left`;
        }
        if (this.gameEndMessage.length > 0) {
            this.gameEnded = true;
            this.gameEndMessage = `Game ended .\n${this.currentOpponentToString()} wins .\n${this.currentPlayerToString()} lost ${this.gameEndMessage}`
        }
    }

    makeMove(currentPlayerMove){
        if ( !this.gameEnded && this.isLegalMove(currentPlayerMove)) {
            this.applyMoveOnBoard(currentPlayerMove);
            if( this.positionOfPieceInCaptureSequence == null ){
                this.turnNum++;
            }
            this.legalMovesForCurrentPlayer = this.listLegalMovesForCurrentPlayer();
            this.updateGameEndStatus();
            console.log( this.gameStatusToString() );
        }
    }

    getPositionFromSquareId( squareId ){
        squareId = squareId.split('-')[1];
        return new Position( Number( squareId[1] ), Number( squareId[3] ) );
    }

    isSquareLegalStartPositionForCurrentPlayer( squareId ){
        const squarePositionOnLogicBoard = this.getPositionFromSquareId( squareId );
        for (const move of this.legalMovesForCurrentPlayer) {
            if ( move.startPosition.equalsTo( squarePositionOnLogicBoard ) ) {
                return true;
            }
        }
        return false;
    }

    listLegalEndPositionsForSelectedStartPosition( startPosition ){
        const idsOfLegalEndSquares = [];
        for (const move of this.legalMovesForCurrentPlayer) {
            if ( move.startPosition.equalsTo( startPosition ) ) {
                idsOfLegalEndSquares.push( move.endPosition );
            }
        }
        return idsOfLegalEndSquares;
    }

    isLegalEndSquareForSelectedStartSquare( endSquareId , startSquareId ){
        const endSquarePositionOnLogicBoard = this.getPositionFromSquareId( endSquareId );
        const startSquarePositionOnLogicBoard = this.getPositionFromSquareId( startSquareId );
        for (const move of this.legalMovesForCurrentPlayer) {
            if ( move.startPosition.equalsTo( startSquarePositionOnLogicBoard ) && move.endPosition.equalsTo( endSquarePositionOnLogicBoard )) {
                return true;
            }
        }
        return false;
    }


    getMoveFromStartAndEndSquaresIds( moveStartSquareId , moveEndSquareId ){
        return new Move( this.getPositionFromSquareId( moveStartSquareId ) , this.getPositionFromSquareId( moveEndSquareId ) );
    }

}








class CheckersBoardUI{

    static numOfExistingBoards = 0;

    boardNum;

    checkersLogic;
    
    graphicBoard;

    isPopMessageOn;

    idOfStartSquareForCurrentPlayerMove;
    idOfEndSquareForCurrentPlayerMove;
    idsOfLegalEndSquaresForSelectedStartSquare;

    constructor(){
        CheckersBoardUI.numOfExistingBoards++;

        this.boardNum = CheckersBoardUI.numOfExistingBoards;

        this.isPopMessageOn = false;

        this.createBoardElementsOnMainContainer();
        this.graphicBoard = document.getElementById( this.getBoardId() );

        this.loadBoardSquares();

        this.setEventListeners();
    }

    createBoardElementsOnMainContainer(){
        const mainContainer = document.getElementById('mainContainer');

        const boardConatiner = document.createElement('div');
        boardConatiner.classList = "boardContainer";
        mainContainer.appendChild(boardConatiner);

        const boardHeader = document.createElement('div');
        boardHeader.classList.add('board-header', 'woodenPanel');
        boardHeader.innerHTML = `Board ${this.boardNum}`;
        boardConatiner.appendChild(boardHeader);
        
        const gamePanel = document.createElement('div');
        gamePanel.classList.add('gamePanel');
        boardConatiner.appendChild(gamePanel);

        const board = document.createElement('div');
        board.setAttribute('id',this.getBoardId());
        board.classList.add('board');
        gamePanel.appendChild(board);

        gamePanel.appendChild(this.createControlPanelElement());
    }

    createControlPanelButton(buttonNameAsStringOfSpacedWords){
        const buttonName = buttonNameAsStringOfSpacedWords;
        const controlPanelButtonElement = document.createElement('div');
        const buttonNameCamelCased = buttonName.split(' ').reduce( 
            (result, current) => result + (result ? current.charAt(0).toUpperCase() : current.charAt(0)) + current.slice(1), '');
        const buttonNameCapitalizedAndSpaced = buttonName.split(' ').reduce( 
            (result, current) => result + (result ? ' ' : '') + current.charAt(0).toUpperCase() + current.slice(1), '');
        controlPanelButtonElement.setAttribute('id',`${this.getBoardId()}-${buttonNameCamelCased}`);
        controlPanelButtonElement.classList.add('woodenPanel', 'gameControlButton');
        controlPanelButtonElement.innerHTML = buttonNameCapitalizedAndSpaced;
        return controlPanelButtonElement;
    }

    createControlPanelElement(){

        const controlPanel = document.createElement('div');
        controlPanel.classList.add('controlPanel', 'woodenPanel');

        const controlButtonsNamesList = ['new game button','draw offer button','resign button'];
        for (const controlButtonName of controlButtonsNamesList) {
            controlPanel.appendChild(this.createControlPanelButton(controlButtonName));
        }
        return controlPanel;
    }

    loadBoardSquares(){
        for (let row = 0; row < boardSideLength(); row++) {
            for (let column = 0; column < boardSideLength(); column++) {
                const square = document.createElement('div');
                square.setAttribute('id',this.getSquareIdFromRowAndColumnNums( row , column ));
                square.classList.add('square');
                if ( row % 2 === column % 2 ){
                    square.classList.add('light');
                }
                else{
                    square.classList.add('dark');
                }
                this.graphicBoard.appendChild(square);
            }
        }
    }

    startNewGame(){
        this.checkersLogic = new CheckersLogic();

        this.idOfStartSquareForCurrentPlayerMove = '';
        this.idOfEndSquareForCurrentPlayerMove = '';

        this.idsOfLegalEndSquaresForSelectedStartSquare = [];

        this.isPopMessageOn = false;

        this.resetAllSquaresBackground();
        this.renderGraphicBoard();
    }

    getBoardId(){
        return `board${this.boardNum}`;
    }

    getSquareIdFromRowAndColumnNums( rowNum , columnNum ){
        return `board${this.boardNum}-r${rowNum}c${columnNum}`; 
    }

    getSquareIdFromPosition( position ){
        return this.getSquareIdFromRowAndColumnNums( position.rowNum , position.columnNum );
    }

    placeGraphicCheckersPieceOnSquare( squareId , isWhitePiece, isKingPiece ){
        const squareToPlacePieceOn = document.getElementById(squareId);
        const pieceToPlaceOnSquare = document.createElement('div');
        pieceToPlaceOnSquare.classList.add('man');
        if (isWhitePiece) {
            pieceToPlaceOnSquare.classList.add('white');
        }
        else{
            pieceToPlaceOnSquare.classList.add('black');
        }
        if (isKingPiece) {
            pieceToPlaceOnSquare.classList.add('king');
            pieceToPlaceOnSquare.innerHTML = 'K';
        }
        squareToPlacePieceOn.appendChild(pieceToPlaceOnSquare);
    }

    removeGraphicCheckersPieceFromSquare( squareId ){
        const squareToRemovePieceFrom = document.getElementById(squareId);
        if (squareToRemovePieceFrom.hasChildNodes()) {
            squareToRemovePieceFrom.removeChild(squareToRemovePieceFrom.firstChild);
        }
    }

    doesSquareContainGraphicPiece( squareId ){
        return document.getElementById(squareId).hasChildNodes();
    }

    getGraphicPieceElementInSquare( squareId ){
        if ( this.doesSquareContainGraphicPiece( squareId )) {
            const squareElement = document.getElementById(squareId);
            return squareElement.firstChild;
        }
        return null;
    }

    isGraphicPieceWhite( pieceElement ){
        return pieceElement.classList.contains('white');
    }

    isGraphicPieceKing( pieceElement ){
        return pieceElement.classList.contains('king');
    }


    doesSquareContainPieceAtBurnRisk(squareId){
        const squareLogicBoardPosition = this.checkersLogic.getPositionFromSquareId(squareId);
        return this.checkersLogic.doesPositionContainPieceAtBurnRisk( squareLogicBoardPosition );
    }

    doesSquareContainPieceInCaptureSequence(squareId){
        const squareLogicBoardPosition = this.checkersLogic.getPositionFromSquareId(squareId);
        return this.checkersLogic.doesPositionContainPieceInCaptureSequence( squareLogicBoardPosition );
    }

    renderGraphicBoard(){
        for (let row = 0; row < boardSideLength(); row++) {
            for (let column = 0; column < boardSideLength(); column++) {
                const graphicBoardSquareId = this.getSquareIdFromRowAndColumnNums(row,column);
                const logicBoardPosition = new Position(row, column);
                this.resetSquareBackground(graphicBoardSquareId);
                if ( this.checkersLogic.isPositionClear( logicBoardPosition ) && this.doesSquareContainGraphicPiece(graphicBoardSquareId) ) {
                    this.removeGraphicCheckersPieceFromSquare(graphicBoardSquareId);
                }
                else if ( !this.checkersLogic.isPositionClear( logicBoardPosition ) ){
                    const pieceOnLogicBoard = this.checkersLogic.getPieceInPosition( logicBoardPosition );
                    if ( this.doesSquareContainGraphicPiece(graphicBoardSquareId) ){
                        const pieceElementOnGraphicBoard = this.getGraphicPieceElementInSquare( graphicBoardSquareId );
                        if ( pieceOnLogicBoard.isWhite !== pieceElementOnGraphicBoard.classList.contains('white') ||
                             pieceOnLogicBoard instanceof(King) !== pieceElementOnGraphicBoard.classList.contains('king')
                            ) 
                        {
                            this.removeGraphicCheckersPieceFromSquare(graphicBoardSquareId);
                            this.placeGraphicCheckersPieceOnSquare( graphicBoardSquareId , pieceOnLogicBoard.isWhite , pieceOnLogicBoard instanceof(King) );
                        }
                    }
                    else{
                        this.placeGraphicCheckersPieceOnSquare( graphicBoardSquareId , pieceOnLogicBoard.isWhite , pieceOnLogicBoard instanceof(King) );
                    }
                    if ( this.checkersLogic.isSquareLegalStartPositionForCurrentPlayer(graphicBoardSquareId) ) {
                        if ( this.doesSquareContainPieceInCaptureSequence( graphicBoardSquareId ) ) {
                            this.setSquareAsMandatorySelection( graphicBoardSquareId );
                        }
                        else if ( this.doesSquareContainPieceAtBurnRisk( graphicBoardSquareId ) ) {
                            this.setSquareAsInBurnRisk( graphicBoardSquareId );
                        }
                        else{
                            this.setSquareAsOptionalStartSquare( graphicBoardSquareId );
                        }
                    }
                }
            }
        }
    }

    resetSquareBackground( squareId ){
        const squareElement = document.getElementById(squareId);
        const isDarkSquare = squareElement.classList.contains('dark');
        squareElement.setAttribute('class','square ' + (isDarkSquare ? 'dark' : 'light'));
    }
    
    resetAllSquaresBackground(){
        for (let row = 0; row < boardSideLength(); row++) {
            for (let column = 0; column < boardSideLength(); column++) {
                this.resetSquareBackground( this.getSquareIdFromRowAndColumnNums( row , column ) );
            }
        }
    }

    setSquareAsOptionalStartSquare( squareId ){
        const squareElement = document.getElementById(squareId);
        squareElement.classList.add('optional-piece-selection');
    }

    setSquareAsSelected( squareId ){
        const squareElement = document.getElementById(squareId);
        squareElement.classList.add('selected');
    }

    deselectSquare( squareId ){
        const squareElement = document.getElementById(squareId);
        squareElement.classList.remove('selected');
    }

    setSquareAsOptionalDestination( squareId ){
        const squareElement = document.getElementById(squareId);
        squareElement.classList.add('optional-piece-destination');
    }

    unsetSquareAsOptionalDestination( squareId ){
        this.resetSquareBackground( squareId );
    }

    setSquareAsInBurnRisk( squareId ){
        const squareElement = document.getElementById(squareId);
        squareElement.classList.add('burn-position');
    }

    setSquareAsMandatorySelection( squareId ){
        const squareElement = document.getElementById(squareId);
        squareElement.classList.add('mandatory-piece-selection');
    }

    updateEndSquaresForSelectedStartSquare( idOfLegalStartSquare ){
        if ( this.idsOfLegalEndSquaresForSelectedStartSquare.length > 0 ) {
            for (const endSquareId of this.idsOfLegalEndSquaresForSelectedStartSquare ) {
                if ( endSquareId != idOfLegalStartSquare ) {
                    this.unsetSquareAsOptionalDestination( endSquareId );
                }
            }
        }
        this.idsOfLegalEndSquaresForSelectedStartSquare = 
            this.listIdsOfLegalEndSquaresForSelectedStartSquare( idOfLegalStartSquare );
        for ( const endSquareId of this.idsOfLegalEndSquaresForSelectedStartSquare ) {
            this.setSquareAsOptionalDestination( endSquareId );
        }
    }

    listIdsOfLegalEndSquaresForSelectedStartSquare( idOfLegalStartSquare ){
        const startSquarePositionOnLogicBoard = this.checkersLogic.getPositionFromSquareId( idOfLegalStartSquare );
        const legalEndPositions = this.checkersLogic.listLegalEndPositionsForSelectedStartPosition( startSquarePositionOnLogicBoard );
        const idsOflegalEndSquares = [];
        for (const endPosition of legalEndPositions ) {
            idsOflegalEndSquares.push( this.getSquareIdFromPosition(endPosition) );
        }
        return idsOflegalEndSquares;
    }

    updateCurrentMoveStartSquare( startSquareId ){
        if ( this.idOfStartSquareForCurrentPlayerMove !== '' ) {
            this.deselectSquare( this.idOfStartSquareForCurrentPlayerMove );
        }
        this.idOfStartSquareForCurrentPlayerMove = startSquareId;
        this.setSquareAsSelected( startSquareId );
        this.updateEndSquaresForSelectedStartSquare( startSquareId );
    }
        
    squareClickHandle( squareElementId ){
        if ( !this.checkersLogic.gameEnded && !this.isPopMessageOn ){
            if (  this.checkersLogic.isSquareLegalStartPositionForCurrentPlayer( squareElementId ) ){
                this.updateCurrentMoveStartSquare( squareElementId );
            }
            else if ( this.checkersLogic.isLegalEndSquareForSelectedStartSquare( squareElementId , this.idOfStartSquareForCurrentPlayerMove ) ){
                // move piece :
                // 1. apply move on logic board
                this.checkersLogic.makeMove( 
                    this.checkersLogic.getMoveFromStartAndEndSquaresIds( this.idOfStartSquareForCurrentPlayerMove , squareElementId ) 
                );

                // 2. render graphic board
                this.renderGraphicBoard();

                // 3. if game ended show game end pop message
                if (this.checkersLogic.gameEnded) {
                    const gameEndPopMessage = new alertPopMessage(this.checkersLogic.gameEndMessage);
                    gameEndPopMessage.showPopMessageOnElement(this.getBoardId());
                }
                
            }
        }
    }

    

    handleDrawOfferButtonClick(){
        if (this.checkersLogic != null && !this.checkersLogic.gameEnded && !this.isPopMessageOn) {
            this.isPopMessageOn = true;
            
            const drawOfferPopMessage = new confirmPopMessage(this.getDrawApprovalMessageForDrawInitiator());
            drawOfferPopMessage.rejectButton.addEventListener('click', () =>{
                this.isPopMessageOn = false;
            })
            drawOfferPopMessage.acceptButton.addEventListener('click', () => {
                this.handleDrawApprovalByInitiator();
            });
            drawOfferPopMessage.showPopMessageOnElement(this.getBoardId());     
        }
    }

    getDrawApprovalMessageForDrawInitiator(){
        return `${this.checkersLogic.currentPlayerToString()} player - Are you sure you want to offer a draw?\n`+
                `If ${this.checkersLogic.currentOpponentToString()} choose to accept the offer, the game will end in a draw.`;
    }

    handleDrawApprovalByInitiator(){
                const drawAcceptancePopMessage = new confirmPopMessage(this.getDrawApprovalMessageForOpponent());
                drawAcceptancePopMessage.rejectButton.addEventListener('click', () =>{
                    this.isPopMessageOn = false;
                })
                drawAcceptancePopMessage.acceptButton.addEventListener('click', () => {
                    this.handleDrawApprovalByOpponent();
                });
                drawAcceptancePopMessage.showPopMessageOnElement(this.getBoardId());
    }

    getDrawApprovalMessageForOpponent(){
        return `${this.checkersLogic.currentOpponentToString()} player - \n`+
            `Your rival, the ${this.checkersLogic.currentPlayerToString()} player, offered a draw.\n`+
            `Do you wish to accept the draw offer?\n`+
            `Your acceptance will end the game in a draw. `;
    }

    handleDrawApprovalByOpponent(){
        this.checkersLogic.gameEnded = true;
        this.resetAllSquaresBackground();
        this.checkersLogic.gameEndMessage = this.getGameEndInDrawMessage();
        const gameEndPopMessage = new alertPopMessage(this.checkersLogic.gameEndMessage);
        gameEndPopMessage.acceptButton.addEventListener('click', () => {
            this.isPopMessageOn = false;
        });
        gameEndPopMessage.showPopMessageOnElement(this.getBoardId());
    }

    getGameEndInDrawMessage(){
        return `Game ended in a draw.\n`+
            `Draw offer made by ${this.checkersLogic.currentPlayerToString()},\n`+
            `was accepted by ${this.checkersLogic.currentOpponentToString()}.`;
    }


    handleResignButtonClick(){
        if (this.checkersLogic != null && !this.checkersLogic.gameEnded && !this.isPopMessageOn) {
            this.isPopMessageOn = true;
            const resignPopMessage = new confirmPopMessage(this.getResignConfirmMessage());
            resignPopMessage.rejectButton.addEventListener('click', () => {
                this.isPopMessageOn = false;
            });
            resignPopMessage.acceptButton.addEventListener('click', () => {
                this.handleResignConfirmation();
            });
            resignPopMessage.showPopMessageOnElement(this.getBoardId());
        }
    }

    getResignConfirmMessage(){
        return `${this.checkersLogic.currentPlayerToString()} player - Are you sure you want to resign?\n`+
            `This will end the game and give victory to ${this.checkersLogic.currentOpponentToString()}.`;
    }

    handleResignConfirmation(){
        this.checkersLogic.gameEnded = true;
        this.resetAllSquaresBackground();
        this.checkersLogic.gameEndMessage = this.getGameEndByResignMessage();
        const gameEndPopMessage = new alertPopMessage(this.checkersLogic.gameEndMessage);
        gameEndPopMessage.acceptButton.addEventListener('click', () => {
            this.isPopMessageOn = false;
        });
        gameEndPopMessage.showPopMessageOnElement(this.getBoardId());
    }

    getGameEndByResignMessage(){
        return `Game ended.\n`+
            `${this.checkersLogic.currentOpponentToString()} player wins\n`+
            `due to ${this.checkersLogic.currentPlayerToString()} player resigning.`;
    }


    setEventListeners() {

        for (const square of this.graphicBoard.children) {
            square.addEventListener( 'click', () =>{
                const squareId = square.getAttribute('id');
                this.squareClickHandle(squareId) });
        }
    
    
        const newGameButton = document.getElementById(`${this.getBoardId()}-newGameButton`);
        newGameButton.addEventListener('click', () => {
            if ( !this.isPopMessageOn ) {
                this.startNewGame();
            }
        })
    
        const drawOfferButton = document.getElementById(`${this.getBoardId()}-drawOfferButton`);
        drawOfferButton.addEventListener('click', () => {
            this.handleDrawOfferButtonClick();
        })
    
        const resignButton = document.getElementById(`${this.getBoardId()}-resignButton`);
        resignButton.addEventListener('click', () => {
            this.handleResignButtonClick();
        })
    
    }
    

}

const addNewBoard = () => {
    new CheckersBoardUI();
}