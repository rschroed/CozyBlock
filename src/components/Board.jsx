import Piece from './Piece';

function Board({
  board,
  pieces,
  placedPieces,
  ghostPlacement,
  activeDragPieceId,
  selectedPieceId,
  cellSize,
  boardRef,
  onPiecePointerDown,
}) {
  const rowCount = board.length;
  const columnCount = Math.max(...board.map((row) => row.length));

  return (
    <div className="board-shell">
      <div
        className="board"
        ref={boardRef}
        style={{ width: columnCount * cellSize, height: rowCount * cellSize }}
      >
        {board.map((row, y) =>
          row.map((value, x) => {
            if (value !== 1) {
              return null;
            }

            return (
              <div
                className="board-cell"
                key={`cell-${x}-${y}`}
                style={{
                  left: x * cellSize,
                  top: y * cellSize,
                  width: cellSize,
                  height: cellSize,
                }}
              />
            );
          }),
        )}

        {Object.entries(placedPieces).map(([pieceId, placement]) => {
          if (pieceId === activeDragPieceId) {
            return null;
          }

          const piece = pieces[pieceId];
          return (
            <Piece
              cellSize={cellSize}
              className={`board-piece ${selectedPieceId === pieceId ? 'is-selected' : ''}`.trim()}
              key={pieceId}
              onPointerDown={(event) => onPiecePointerDown(pieceId, event, placement)}
              piece={piece}
              rotation={placement.rotation}
              style={{
                left: placement.x * cellSize,
                top: placement.y * cellSize,
              }}
            />
          );
        })}

        {ghostPlacement ? (
          <Piece
            cellSize={cellSize}
            className="ghost-piece"
            colorOverride={
              ghostPlacement.isValid ? 'rgba(75, 157, 93, 0.45)' : 'rgba(204, 78, 78, 0.45)'
            }
            piece={pieces[ghostPlacement.pieceId]}
            rotation={ghostPlacement.rotation}
            style={{
              left: ghostPlacement.x * cellSize,
              top: ghostPlacement.y * cellSize,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Board;
