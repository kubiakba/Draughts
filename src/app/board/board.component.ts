import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Piece, PiecePosition, Player, Position} from '../piece/piece';
import {PieceMoverService} from '../piece/piece.mover.service';
import {ShowPossibleMovesService} from './show.possible.moves.service';
import {fulfillStartingPositionMap} from './board.starter';
import {
  getPieceByPosition,
  getPieceInMiddlePosition,
  getPositionFromArray,
  getPositionFromMap,
  isMoveBeatable,
  setNewPieceByPosition
} from './board.calculator';
import {calculatePossiblePositions, getActivePlayerBeatingPositions} from './board.mover.calculator';
import {WinningInfoComponent} from '../winning-info/winning-info.component';
import {PopupShower} from '../popup-shower/popup-shower';
import {StartNewGame} from './start.new.game';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-board',
  template: `
    <div class="board-wrapper">
      <div *ngFor="let row of positions">
        <div class="board-column">
          <div *ngFor="let column of positions">
            <app-square (click)="performAction(row,column)" [position]="createPosition(row,column)"></app-square>
          </div>
        </div>
      </div>
    </div>`,
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {

  positions: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  map = new Map<Position, Piece>();
  activePlayer: Player = Player.WHITE;
  lastClickedPosition: Position;
  lastShownPossiblePositions: Position[] = [];
  startNewGameSubscription: Subscription;

  constructor(private pieceMoverService: PieceMoverService,
              private showPossibleMovesService: ShowPossibleMovesService,
              private popupShower: PopupShower,
              private startNewGame: StartNewGame) {
  }

  ngOnInit(): void {
    this.map = fulfillStartingPositionMap();
    this.startNewGameSubscription = this.startNewGame.getObservable().subscribe(() => {
      this.prepareForNewGame();
    });
  }

  ngAfterViewInit(): void {
    this.drawPiecesOnBoard();
  }

  performAction(row: number, column: number) {
    const position = this.createPosition(row, column);
    if (this.isAllowToMove(position)) {
      const movedPieceInfo = this.shouldPieceBeMoved(position);
      this.setLastClickedPosition(position);
      this.handlePossibleMoves(movedPieceInfo, position);
      this.handleChangePlayer(movedPieceInfo, position);
    }
    this.handleEndGame();
  }

  shouldPieceBeMoved(position: Position): PieceMoveInfo {
    if (this.isMovePossible(position)) {
      const newPiecePosition = setNewPieceByPosition(this.map, this.lastClickedPosition, position);
      const wasBeatable = this.tryToBeatPiece(position);
      this.setNewPieceOnBoard(newPiecePosition, position);
      this.removeOldPieceFromBoard();
      return new PieceMoveInfo(true, wasBeatable);
    }
    return new PieceMoveInfo(false, false);
  }

  tryToBeatPiece(position: Position): boolean {
    if (isMoveBeatable(this.lastClickedPosition, position, this.map)) {
      const pieceInMiddlePosition = getPieceInMiddlePosition(this.lastClickedPosition, position, this.map);
      this.pieceMoverService.removePiece(getPieceByPosition(this.map, pieceInMiddlePosition));
      this.removePositionFromBoard(pieceInMiddlePosition);
      return true;
    }
    return false;
  }

  drawPossibleMoves(position: Position) {
    const possiblePositions = calculatePossiblePositions(this.map, getPieceByPosition(this.map, position));
    const otherPossibleBeating = getActivePlayerBeatingPositions(this.map, getPieceByPosition(this.map, position));
    if (otherPossibleBeating.length === 0 || possiblePositions.beatablePositions.length > 0) {
      if (possiblePositions.beatablePositions.length > 0) {
        this.drawBeatableMoves(possiblePositions);
      } else {
        this.drawNonBeatableMoves(possiblePositions);
      }
    }
  }

  clearLastPossibleMoves(position: Position) {
    this.lastClickedPosition = position;
    this.lastShownPossiblePositions.forEach(singlePosition => {
      this.showPossibleMovesService.removePossiblePosition(singlePosition);
    });
    this.lastShownPossiblePositions = [];
  }

  ngOnDestroy(): void {
    this.startNewGameSubscription.unsubscribe();
  }

  private prepareForNewGame() {
    Array.from(this.map.keys()).forEach(position => this.pieceMoverService.removePiece(getPieceByPosition(this.map, position)));
    this.map = fulfillStartingPositionMap();
    this.activePlayer = Player.WHITE;
    this.drawPiecesOnBoard();
  }

  private drawPiecesOnBoard() {
    Array.from(this.map.keys()).forEach(key => {
      this.pieceMoverService.setPiece(new PiecePosition(key, this.map.get(key)));
    });
  }

  private isAllowToMove(position: Position) {
    const firstCondition = this.isActivePlayerPiece(position);
    const secondCondition = this.lastClickedPosition
      && getPieceByPosition(this.map, this.lastClickedPosition).piece.owner === this.activePlayer
      && getPositionFromArray(this.lastShownPossiblePositions, position);
    return firstCondition || secondCondition;
  }

  private isActivePlayerPiece(position: Position): boolean {
    const piece = getPieceByPosition(this.map, position);
    return piece.piece && piece.piece.owner === this.activePlayer;
  }

  private isMovePossible(position: Position) {
    return getPositionFromArray(this.lastShownPossiblePositions, position);
  }

  private removeOldPieceFromBoard() {
    this.pieceMoverService.removePiece(getPieceByPosition(this.map, this.lastClickedPosition));
    this.removePositionFromBoard(this.lastClickedPosition);
  }

  private setNewPieceOnBoard(newPiecePosition: PiecePosition, position: Position) {
    this.pieceMoverService.setPiece(newPiecePosition);
    this.map.set(position, newPiecePosition.piece);
  }

  private drawNonBeatableMoves(possiblePositions) {
    possiblePositions.positions.forEach(singlePosition => {
      this.lastShownPossiblePositions.push(singlePosition);
      this.showPossibleMovesService.showPossiblePosition(singlePosition);
    });
  }

  private drawBeatableMoves(possiblePositions) {
    possiblePositions.beatablePositions.forEach(singlePosition => {
      this.lastShownPossiblePositions.push(singlePosition);
      this.showPossibleMovesService.showPossiblePosition(singlePosition);
    });
  }

  private removePositionFromBoard(positionToRemove: Position) {
    this.map.delete(getPositionFromMap(this.map, positionToRemove));
  }

  private handlePossibleMoves(movedPieceInfo, position: Position) {
    if ((!movedPieceInfo.wasMoved)) {
      this.drawPossibleMoves(position);
    } else if (movedPieceInfo.wasBeatable && calculatePossiblePositions(this.map, getPieceByPosition(this.map, position)).beatablePositions.length > 0) {
      this.drawPossibleMoves(position);
    }
  }

  private setLastClickedPosition(position: Position) {
    if (this.lastClickedPosition) {
      this.clearLastPossibleMoves(position);
    } else {
      this.lastClickedPosition = position;
    }
  }

  private createPosition(row: number, column: number): Position {
    return new Position(row, column);
  }

  private handleChangePlayer(movedPieceInfo: PieceMoveInfo, position: Position) {
    if ((movedPieceInfo.wasMoved && !movedPieceInfo.wasBeatable) || movedPieceInfo.wasMoved && movedPieceInfo.wasBeatable
      && calculatePossiblePositions(this.map, getPieceByPosition(this.map, position)).beatablePositions.length === 0) {
      this.changeActivePlayer();
    }
  }

  private changeActivePlayer() {
    if (this.activePlayer === Player.BLACK) {
      this.activePlayer = Player.WHITE;
    } else if (this.activePlayer === Player.WHITE) {
      this.activePlayer = Player.BLACK;
    }
  }

  private handleEndGame() {
    const blackPlayer = Array.from(this.map.values()).find(piece => piece.owner === Player.BLACK);
    const whitePlayer = Array.from(this.map.values()).find(piece => piece.owner === Player.WHITE);
    if (!!!blackPlayer) {
      this.popupShower.add(WinningInfoComponent, {inputs: [{value: ['winningPlayer', Player[Player.WHITE]]}], outputs: []});
    } else if (!!!whitePlayer) {
      this.popupShower.add(WinningInfoComponent, {inputs: [{value: ['winningPlayer', Player[Player.BLACK]]}], outputs: []});
    }
  }
}

export class PieceMoveInfo {
  wasMoved: boolean;
  wasBeatable: boolean;

  constructor(wasMoved: boolean, wasBeatable: boolean) {
    this.wasMoved = wasMoved;
    this.wasBeatable = wasBeatable;
  }
}
