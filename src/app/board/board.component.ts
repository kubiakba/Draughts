import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Piece, PiecePosition, Player} from '../piece/piece';
import {PieceMoverService} from './piece.mover.service';
import {ShowPossibleMovesService} from './show.possible.moves.service';
import {fulfillStartingPositionMap} from './board.starter';
import {calculatePossiblePositions, getPieceByPosition} from './board.calculator';

@Component({
  selector: 'app-board',
  template: `
    <div *ngFor="let row of positions">
      <div class="board-column">
        <div *ngFor="let column of positions">
          <app-square (click)="showPossibleMoves(row,column)" [row]="row" [column]="column"></app-square>
        </div>
      </div>
    </div>`,
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {

  positions: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  map = new Map<string, Piece>();
  activePlayer: Player = Player.WHITE;

  constructor(private pieceMoverService: PieceMoverService,
              private showPossibleMovesService: ShowPossibleMovesService) {
  }

  ngOnInit(): void {
    this.map = fulfillStartingPositionMap();
  }

  ngAfterViewInit(): void {
    Array.from(this.map.keys()).forEach(key => {
      this.pieceMoverService.setPiece(new PiecePosition(key, this.map.get(key)));
    });
  }

  showPossibleMoves(row: number, column: number) {
    const possiblePositions = calculatePossiblePositions(this.map, this.activePlayer,
      getPieceByPosition(this.map, row.toString() + column.toString()));
    possiblePositions.forEach(position => {
      this.showPossibleMovesService.showPossiblePosition(position);
    });
  }

}
