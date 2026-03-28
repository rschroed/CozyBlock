import { useEffect, useMemo, useRef, useState } from 'react';
import { LEVELS, PIECES } from '../data/levels';
import {
  buildOccupancyMap,
  canPlacePiece,
  isBoardComplete,
  normalizeRotation,
  placePiece,
} from '../utils/grid';
import Board from './Board';
import Piece from './Piece';

const CELL_SIZE = 52;

function createInitialTrayRotations(pieces) {
  return Object.fromEntries(pieces.map((piece) => [piece.id, 0]));
}

function Game() {
  const boardRef = useRef(null);
  const dragStateRef = useRef(null);
  const placedPiecesRef = useRef({});
  const currentLevelRef = useRef(LEVELS[0]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [placedPieces, setPlacedPieces] = useState({});
  const [trayRotations, setTrayRotations] = useState(createInitialTrayRotations(PIECES));
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const currentLevel = LEVELS[levelIndex];
  const pieceMap = useMemo(() => Object.fromEntries(PIECES.map((piece) => [piece.id, piece])), []);

  useEffect(() => {
    placedPiecesRef.current = placedPieces;
  }, [placedPieces]);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => {
    currentLevelRef.current = currentLevel;
  }, [currentLevel]);

  const occupancyMap = useMemo(
    () => buildOccupancyMap(currentLevel.board, PIECES, placedPieces),
    [currentLevel.board, placedPieces],
  );
  const isComplete = isBoardComplete(currentLevel.board, occupancyMap);

  const getPieceRotation = (pieceId) => {
    if (dragState?.pieceId === pieceId) {
      return dragState.rotation;
    }

    return placedPieces[pieceId]?.rotation ?? trayRotations[pieceId] ?? 0;
  };

  const computePreview = (pieceId, pointer, grabOffset, rotation) => {
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) {
      return null;
    }

    const snappedX = Math.round((pointer.x - boardRect.left - grabOffset.x) / CELL_SIZE);
    const snappedY = Math.round((pointer.y - boardRect.top - grabOffset.y) / CELL_SIZE);
    const isValid = canPlacePiece(
      currentLevelRef.current.board,
      PIECES,
      placedPiecesRef.current,
      pieceMap[pieceId],
      snappedX,
      snappedY,
      rotation,
      pieceId,
    );

    return {
      pieceId,
      x: snappedX,
      y: snappedY,
      rotation,
      isValid,
    };
  };

  const updateDragState = (nextState) => {
    dragStateRef.current = nextState;
    setDragState(nextState);
  };

  const beginDrag = (pieceId, event, sourcePlacement = null) => {
    if (isComplete || event.button > 0) {
      return;
    }

    event.preventDefault();
    const pieceRect = event.currentTarget.getBoundingClientRect();
    const rotation = sourcePlacement?.rotation ?? trayRotations[pieceId] ?? 0;
    const pointer = { x: event.clientX, y: event.clientY };
    const grabOffset = {
      x: event.clientX - pieceRect.left,
      y: event.clientY - pieceRect.top,
    };
    const nextDragState = {
      pieceId,
      pointerId: event.pointerId,
      pointer,
      grabOffset,
      rotation,
      sourcePlacement,
      preview: computePreview(pieceId, pointer, grabOffset, rotation),
    };

    setSelectedPieceId(pieceId);
    updateDragState(nextDragState);
  };

  const resetLevelState = () => {
    updateDragState(null);
    setPlacedPieces({});
    setTrayRotations(createInitialTrayRotations(PIECES));
    setSelectedPieceId(null);
  };

  const finishDrag = (currentDragState) => {
    if (!currentDragState) {
      return;
    }

    if (currentDragState.preview?.isValid) {
      setPlacedPieces((currentPlacedPieces) =>
        placePiece(
          currentPlacedPieces,
          currentDragState.pieceId,
          currentDragState.preview.x,
          currentDragState.preview.y,
          currentDragState.rotation,
        ),
      );
    } else if (!currentDragState.sourcePlacement) {
      setTrayRotations((currentTrayRotations) => ({
        ...currentTrayRotations,
        [currentDragState.pieceId]: currentDragState.rotation,
      }));
    }

    updateDragState(null);
  };

  const rotateActivePiece = () => {
    if (!selectedPieceId || isComplete) {
      return;
    }

    if (dragStateRef.current) {
      const currentDragState = dragStateRef.current;
      const nextRotation = normalizeRotation(currentDragState.rotation + 1);
      const nextPreview = computePreview(
        currentDragState.pieceId,
        currentDragState.pointer,
        currentDragState.grabOffset,
        nextRotation,
      );

      updateDragState({
        ...currentDragState,
        rotation: nextRotation,
        preview: nextPreview,
      });
      return;
    }

    if (placedPiecesRef.current[selectedPieceId]) {
      const currentPlacement = placedPiecesRef.current[selectedPieceId];
      const nextRotation = normalizeRotation(currentPlacement.rotation + 1);
      const canRotateInPlace = canPlacePiece(
        currentLevel.board,
        PIECES,
        placedPiecesRef.current,
        pieceMap[selectedPieceId],
        currentPlacement.x,
        currentPlacement.y,
        nextRotation,
        selectedPieceId,
      );

      if (!canRotateInPlace) {
        return;
      }

      setPlacedPieces((currentPlacedPieces) =>
        placePiece(
          currentPlacedPieces,
          selectedPieceId,
          currentPlacement.x,
          currentPlacement.y,
          nextRotation,
        ),
      );
      return;
    }

    setTrayRotations((currentTrayRotations) => ({
      ...currentTrayRotations,
      [selectedPieceId]: normalizeRotation((currentTrayRotations[selectedPieceId] ?? 0) + 1),
    }));
  };

  const resetGame = () => {
    resetLevelState();
  };

  const goToLevel = (nextIndex) => {
    resetLevelState();
    setLevelIndex(nextIndex);
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      const currentDragState = dragStateRef.current;
      if (!currentDragState || event.pointerId !== currentDragState.pointerId) {
        return;
      }

      event.preventDefault();
      const nextPointer = { x: event.clientX, y: event.clientY };
      const nextPreview = computePreview(
        currentDragState.pieceId,
        nextPointer,
        currentDragState.grabOffset,
        currentDragState.rotation,
      );

      updateDragState({
        ...currentDragState,
        pointer: nextPointer,
        preview: nextPreview,
      });
    };

    const handlePointerUp = (event) => {
      const currentDragState = dragStateRef.current;
      if (!currentDragState || event.pointerId !== currentDragState.pointerId) {
        return;
      }

      finishDrag(currentDragState);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() !== 'r') {
        return;
      }

      event.preventDefault();
      rotateActivePiece();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const canGoPrevious = levelIndex > 0;
  const canGoNext = levelIndex < LEVELS.length - 1;

  const trayPieces = PIECES.filter(
    (piece) => !placedPieces[piece.id] && dragState?.pieceId !== piece.id,
  );

  return (
    <div className="app">
      <div className="game">
        <div className="game-header">
          <div className="game-copy">
            <h1>Cozy Block Prototype</h1>
            <p>
              Puzzle {levelIndex + 1} of {LEVELS.length}: {currentLevel.name}
            </p>
          </div>

          <div className="controls">
            <button disabled={!selectedPieceId || isComplete} onClick={rotateActivePiece} type="button">
              Rotate
            </button>
            <button onClick={resetGame} type="button">
              Reset
            </button>
          </div>
        </div>

        <div className="level-controls">
          <button disabled={!canGoPrevious} onClick={() => goToLevel(levelIndex - 1)} type="button">
            Previous
          </button>
          <div className="level-pills">
            {LEVELS.map((level, index) => (
              <button
                className={index === levelIndex ? 'active' : ''}
                key={level.id}
                onClick={() => goToLevel(index)}
                type="button"
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button disabled={!canGoNext} onClick={() => goToLevel(levelIndex + 1)} type="button">
            Next
          </button>
        </div>

        <div className={`status ${isComplete ? 'complete' : ''}`.trim()}>
          {isComplete ? `Complete: ${currentLevel.name}` : 'Fill every visible cell.'}
        </div>

        <Board
          activeDragPieceId={dragState?.pieceId ?? null}
          board={currentLevel.board}
          boardRef={boardRef}
          cellSize={CELL_SIZE}
          ghostPlacement={dragState?.preview ?? null}
          onPiecePointerDown={beginDrag}
          pieces={pieceMap}
          placedPieces={placedPieces}
          selectedPieceId={selectedPieceId}
        />

        {dragState ? (
          <Piece
            cellSize={CELL_SIZE}
            className="floating-piece"
            piece={pieceMap[dragState.pieceId]}
            rotation={dragState.rotation}
            style={{
              left: dragState.pointer.x - dragState.grabOffset.x,
              top: dragState.pointer.y - dragState.grabOffset.y,
            }}
          />
        ) : null}

        <div className="tray">
          {trayPieces.length > 0 ? (
            trayPieces.map((piece) => (
              <div className="tray-item" key={piece.id}>
                <Piece
                  cellSize={CELL_SIZE}
                  className={selectedPieceId === piece.id ? 'is-selected' : ''}
                  onPointerDown={(event) => beginDrag(piece.id, event)}
                  piece={piece}
                  rotation={getPieceRotation(piece.id)}
                />
                <div className="tray-label">{piece.name}</div>
              </div>
            ))
          ) : (
            <div className="tray-empty">All pieces are on the board.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
