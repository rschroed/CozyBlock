import { getOccupiedCells, rotateShape } from '../utils/grid';

function Piece({
  piece,
  rotation = 0,
  cellSize,
  colorOverride,
  className = '',
  style,
  onPointerDown,
}) {
  const shape = rotateShape(piece.shape, rotation);
  const occupiedCells = getOccupiedCells(shape);
  const width = (shape[0]?.length ?? 0) * cellSize;
  const height = shape.length * cellSize;

  return (
    <div
      aria-label={piece.name}
      className={`piece ${className}`.trim()}
      onPointerDown={onPointerDown}
      role="button"
      style={{ width, height, ...style }}
      tabIndex={0}
    >
      {occupiedCells.map((cell) => (
        <div
          className="piece-cell"
          key={`${piece.id}-${cell.x}-${cell.y}`}
          style={{
            left: cell.x * cellSize,
            top: cell.y * cellSize,
            width: cellSize,
            height: cellSize,
            background: colorOverride ?? piece.color,
          }}
        />
      ))}
    </div>
  );
}

export default Piece;
