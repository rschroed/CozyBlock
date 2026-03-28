export function normalizeRotation(rotation) {
  return ((rotation % 4) + 4) % 4;
}

export function rotateShape(shape, rotation = 0) {
  const turns = normalizeRotation(rotation);
  let nextShape = shape.map((row) => [...row]);

  for (let turn = 0; turn < turns; turn += 1) {
    const height = nextShape.length;
    const width = nextShape[0].length;
    const rotated = Array.from({ length: width }, () => Array(height).fill(0));

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        rotated[x][height - 1 - y] = nextShape[y][x];
      }
    }

    nextShape = rotated;
  }

  return nextShape;
}

export function getOccupiedCells(shape) {
  const cells = [];

  shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        cells.push({ x, y });
      }
    });
  });

  return cells;
}

export function buildOccupancyMap(board, pieces, placedPieces, ignorePieceId = null) {
  const occupancy = board.map((row) => row.map(() => null));
  const pieceMap = Object.fromEntries(pieces.map((piece) => [piece.id, piece]));

  Object.entries(placedPieces).forEach(([pieceId, placement]) => {
    if (pieceId === ignorePieceId) {
      return;
    }

    const piece = pieceMap[pieceId];
    if (!piece) {
      return;
    }

    const rotatedShape = rotateShape(piece.shape, placement.rotation);

    getOccupiedCells(rotatedShape).forEach((cell) => {
      const boardX = placement.x + cell.x;
      const boardY = placement.y + cell.y;

      if (occupancy[boardY]?.[boardX] !== undefined) {
        occupancy[boardY][boardX] = pieceId;
      }
    });
  });

  return occupancy;
}

export function canPlacePiece(
  board,
  pieces,
  placedPieces,
  piece,
  x,
  y,
  rotation = 0,
  ignorePieceId = null,
) {
  const occupancy = buildOccupancyMap(board, pieces, placedPieces, ignorePieceId);
  const rotatedShape = rotateShape(piece.shape, rotation);

  return getOccupiedCells(rotatedShape).every((cell) => {
    const boardX = x + cell.x;
    const boardY = y + cell.y;

    if (board[boardY]?.[boardX] !== 1) {
      return false;
    }

    return occupancy[boardY][boardX] === null;
  });
}

export function placePiece(placedPieces, pieceId, x, y, rotation) {
  return {
    ...placedPieces,
    [pieceId]: { x, y, rotation: normalizeRotation(rotation) },
  };
}

export function removePiece(placedPieces, pieceId) {
  const nextPlacedPieces = { ...placedPieces };
  delete nextPlacedPieces[pieceId];
  return nextPlacedPieces;
}

export function isBoardComplete(board, occupancyMap) {
  return board.every((row, y) =>
    row.every((value, x) => {
      if (value !== 1) {
        return true;
      }

      return occupancyMap[y][x] !== null;
    }),
  );
}
