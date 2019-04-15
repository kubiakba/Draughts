import {Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {PieceMoverService} from '../board/piece.mover.service';
import {Subscription} from 'rxjs';
import {PiecePosition, Player} from '../piece/piece';
import {shouldSquareHavePieceAtStart} from '../board/board.starter';
import {ShowPossibleMovesService} from '../board/show.possible.moves.service';

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

  @Input() row: number;
  @Input() column: number;
  @ViewChild('piece', {read: ElementRef}) pieceRef: ElementRef;
  @ViewChild('square', {read: ElementRef}) squareRef: ElementRef;
  pieceMoverSubscription: Subscription;
  showPossibleMovesSubscription: Subscription;

  constructor(private boardPieceMoverService: PieceMoverService,
              private showPossibleMovesService: ShowPossibleMovesService,
              private renderer: Renderer2) {
    this.pieceMoverSubscription = boardPieceMoverService.getPieceLocation().subscribe(piece => {
      this.putPieceOnBoard(piece);
    });
    this.showPossibleMovesSubscription = this.showPossibleMovesService.getPossiblePosition().subscribe(position => {
      if (this.shouldChangeBeAppliedToThisSquare(position)) {
        this.renderer.addClass(this.squareRef.nativeElement, 'square-possible-move');
      }
    });
  }

  static splitPiecePositionToColumnAndRow(piece: PiecePosition): string[] {
    return piece.position.split('');
  }

  chooseColorOfSquare() {
    if (shouldSquareHavePieceAtStart(this.row, this.column)) {
      return 'square-color-grey';
    } else {
      return 'square-color-white';
    }
  }

  putPieceOnBoard(piece: PiecePosition) {
    const columnAndRow = SquareComponent.splitPiecePositionToColumnAndRow(piece);
    if (this.shouldChangeBeAppliedToThisSquare(columnAndRow)) {
      if (piece.piece.owner === Player.BLACK) {
        this.renderer.addClass(this.pieceRef.nativeElement, 'square-black-pawn');
      } else if (piece.piece.owner === Player.WHITE) {
        this.renderer.addClass(this.pieceRef.nativeElement, 'square-white-pawn');
      }
    }
  }

  ngOnDestroy(): void {
    this.pieceMoverSubscription.unsubscribe();
    this.showPossibleMovesSubscription.unsubscribe();
  }

  private shouldChangeBeAppliedToThisSquare(rowAndColumn) {
    return rowAndColumn[0] === this.row.toString() && rowAndColumn[1] === this.column.toString();
  }
}
