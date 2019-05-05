import {Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {PieceMoverService, PieceMoveStatus} from '../board/piece.mover.service';
import {Subscription} from 'rxjs';
import {PiecePosition, Position} from '../piece/piece';
import {shouldSquareHavePieceAtStart} from '../board/board.starter';
import {ShowPossibleMovesService} from '../board/show.possible.moves.service';
import {drawPieceOnBoard, removePieceFromBoard} from '../piece/piece.drawer';


@Component({
  selector: 'app-square',
  template: `
    <div class="square-wrapper" #square
         [ngClass]="chooseColorOfSquare()">
      <div #piece class="square-piece"></div>
    </div>`,
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnDestroy {

  @Input() position: Position;
  @ViewChild('piece', {read: ElementRef}) pieceRef: ElementRef;
  @ViewChild('square', {read: ElementRef}) squareRef: ElementRef;
  pieceMoverSubscription: Subscription;
  showPossibleMovesSubscription: Subscription;

  constructor(private boardPieceMoverService: PieceMoverService,
              private showPossibleMovesService: ShowPossibleMovesService,
              private renderer: Renderer2) {
    this.pieceMoverSubscription = boardPieceMoverService.getPieceLocation().subscribe(this.handlePieceMoveOnBoard());
    this.showPossibleMovesSubscription = this.showPossibleMovesService.getPossiblePosition().subscribe(this.handleShowingPossibleMoves());
  }

  chooseColorOfSquare() {
    if (shouldSquareHavePieceAtStart(this.position)) {
      return 'square-color-grey';
    } else {
      return 'square-color-white';
    }
  }

  putPieceOnBoard(piece: PiecePosition) {
    if (this.shouldChangeBeAppliedToThisSquare(piece.position)) {
      drawPieceOnBoard(piece, this.renderer, this.pieceRef.nativeElement);
    }
  }

  removePieceFromBoard(piece: PiecePosition) {
    if (this.shouldChangeBeAppliedToThisSquare(piece.position)) {
      removePieceFromBoard(piece, this.renderer, this.pieceRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.pieceMoverSubscription.unsubscribe();
    this.showPossibleMovesSubscription.unsubscribe();
  }

  private handleShowingPossibleMoves() {
    return position => {
      if (this.shouldChangeBeAppliedToThisSquare(position.position)) {
        if (position.active) {
          this.renderer.addClass(this.squareRef.nativeElement, 'square-possible-move');
        } else {
          this.renderer.removeClass(this.squareRef.nativeElement, 'square-possible-move');
        }
      }
    };
  }

  private handlePieceMoveOnBoard() {
    return piece => {
      if (piece.status === PieceMoveStatus.SET) {
        this.putPieceOnBoard(piece.piece);
      } else if (piece.status === PieceMoveStatus.REMOVE) {
        this.removePieceFromBoard(piece.piece);
      }
    };
  }

  private shouldChangeBeAppliedToThisSquare(position: Position): boolean {
    if (position) {
      return position.row === this.position.row && position.column === this.position.column;
    }
    return false;
  }
}
