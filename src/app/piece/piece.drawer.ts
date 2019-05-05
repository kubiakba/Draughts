import {PiecePosition, PieceType, Player} from './piece';
import {Renderer2} from '@angular/core';

export function drawPieceOnBoard(piece: PiecePosition, renderer: Renderer2, element: any) {
  const player: string = Player[piece.piece.owner].toLowerCase();
  const type: string = PieceType[piece.piece.type].toLowerCase();
  renderer.addClass(element, `square-${player}-${type}`);
}

export function removePieceFromBoard(piece: PiecePosition, renderer: Renderer2, element: any) {
  const player: string = Player[piece.piece.owner].toLowerCase();
  const type: string = PieceType[piece.piece.type].toLowerCase();
  renderer.removeClass(element, `square-${player}-${type}`);
}
