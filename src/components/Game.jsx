import { useEffect, useMemo, useRef, useState } from 'react';
import { LEVELS } from '../data/levels';
import { PIECE_LIBRARY } from '../data/pieces';
import {
  buildOccupancyMap,
  canPlacePiece,
  isBoardComplete,
  normalizeRotation,
  placePiece,
} from '../utils/grid';
import Board from './Board';
import Piece from './Piece';

const DESKTOP_CELL_SIZE = 52;
const CARD_MAX_WIDTH = 392;
const BOARD_HORIZONTAL_PADDING = 56;

function createInitialTrayRotations(pieceIds) {
  return Object.fromEntries(pieceIds.map((pieceId) => [pieceId, 0]));
}

function getLevelPieces(level) {
  return level.pieceIds.map((pieceId) => PIECE_LIBRARY[pieceId]).filter(Boolean);
}

function Game() {
  const boardRef = useRef(null);
  const trayRef = useRef(null);
  const dragStateRef = useRef(null);
  const placedPiecesRef = useRef({});
  const currentLevelRef = useRef(LEVELS[0]);
  const cellSizeRef = useRef(DESKTOP_CELL_SIZE);
  const [levelIndex, setLevelIndex] = useState(0);
  const [placedPieces, setPlacedPieces] = useState({});
  const [trayRotations, setTrayRotations] = useState(
    createInitialTrayRotations(LEVELS[0].pieceIds),
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [isLevelPickerOpen, setIsLevelPickerOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === 'undefined' ? 1024 : window.innerWidth,
  );
  const currentLevel = LEVELS[levelIndex];
  const currentLevelPieces = useMemo(() => getLevelPieces(currentLevel), [currentLevel]);
  const pieceMap = PIECE_LIBRARY;
  const boardColumnCount = Math.max(...currentLevel.board.map((row) => row.length));
  const availableBoardWidth =
    Math.min(CARD_MAX_WIDTH, Math.max(320, viewportWidth - 28)) - BOARD_HORIZONTAL_PADDING;
  const cellSize = Math.max(
    34,
    Math.min(DESKTOP_CELL_SIZE, Math.floor(availableBoardWidth / boardColumnCount)),
  );

  useEffect(() => {
    placedPiecesRef.current = placedPieces;
  }, [placedPieces]);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => {
    currentLevelRef.current = currentLevel;
  }, [currentLevel]);

  useEffect(() => {
    cellSizeRef.current = cellSize;
  }, [cellSize]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const occupancyMap = useMemo(
    () => buildOccupancyMap(currentLevel.board, currentLevelPieces, placedPieces),
    [currentLevel.board, currentLevelPieces, placedPieces],
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

    const activeCellSize = cellSizeRef.current;
    const snappedX = Math.round((pointer.x - boardRect.left - grabOffset.x) / activeCellSize);
    const snappedY = Math.round((pointer.y - boardRect.top - grabOffset.y) / activeCellSize);
    const isValid = canPlacePiece(
      currentLevelRef.current.board,
      getLevelPieces(currentLevelRef.current),
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

  const isPointerInsideRect = (pointer, element) => {
    const rect = element?.getBoundingClientRect();
    if (!rect) {
      return false;
    }

    return (
      pointer.x >= rect.left &&
      pointer.x <= rect.right &&
      pointer.y >= rect.top &&
      pointer.y <= rect.bottom
    );
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

  const resetLevelState = (level = currentLevelRef.current) => {
    updateDragState(null);
    setPlacedPieces({});
    setTrayRotations(createInitialTrayRotations(level.pieceIds));
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
    } else if (isPointerInsideRect(currentDragState.pointer, trayRef.current)) {
      if (currentDragState.sourcePlacement) {
        setPlacedPieces((currentPlacedPieces) => {
          const nextPlacedPieces = { ...currentPlacedPieces };
          delete nextPlacedPieces[currentDragState.pieceId];
          return nextPlacedPieces;
        });
      }

      setTrayRotations((currentTrayRotations) => ({
        ...currentTrayRotations,
        [currentDragState.pieceId]: currentDragState.rotation,
      }));
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
        currentLevelPieces,
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

  const handleRotateButtonPointerDown = (event) => {
    if (event.pointerType !== 'touch') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    rotateActivePiece();
  };

  const resetGame = () => {
    resetLevelState();
  };

  const goToLevel = (nextIndex) => {
    resetLevelState(LEVELS[nextIndex]);
    setLevelIndex(nextIndex);
    setIsLevelPickerOpen(false);
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
      if (event.key === 'Escape') {
        setIsLevelPickerOpen(false);
        return;
      }

      if (event.key.toLowerCase() !== 'r') {
        return;
      }

      event.preventDefault();
      rotateActivePiece();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const hasAnyPlacedPieces = Object.keys(placedPieces).length > 0;
  const hasNextPuzzle = levelIndex < LEVELS.length - 1;
  const isRotateActive = Boolean(selectedPieceId || dragState?.pieceId) && !isComplete;

  const trayPieces = currentLevelPieces.filter(
    (piece) => !placedPieces[piece.id] && dragState?.pieceId !== piece.id,
  );

  return (
    <div className="app">
      <div className="game game-card">
        <div className="game-header header">
          <div className="game-copy">
            <h1>Cozy Block Prototype</h1>
            <button className="puzzle-trigger" onClick={() => setIsLevelPickerOpen(true)} type="button">
              Puzzle {levelIndex + 1} of {LEVELS.length}: {currentLevel.name}
            </button>
          </div>

          <div className="header-bubble">
            {hasAnyPlacedPieces ? (
              <button className="bubble bubble-reset" onClick={resetGame} type="button">
                Reset
                <br />
                Puzzle
              </button>
            ) : (
              <div className="bubble bubble-helper">
                Fill the
                <br />
                grid!
              </div>
            )}
          </div>
        </div>

        <div className="play-area game-canvas">
          <div className="board-area">
            <Board
              activeDragPieceId={dragState?.pieceId ?? null}
              board={currentLevel.board}
              boardRef={boardRef}
              cellSize={cellSize}
              ghostPlacement={dragState?.preview ?? null}
              onPiecePointerDown={beginDrag}
              pieces={pieceMap}
              placedPieces={placedPieces}
              selectedPieceId={selectedPieceId}
            />
          </div>

          {dragState ? (
            <Piece
              cellSize={cellSize}
              className="floating-piece"
              piece={pieceMap[dragState.pieceId]}
              rotation={dragState.rotation}
              style={{
                left: dragState.pointer.x - dragState.grabOffset.x,
                top: dragState.pointer.y - dragState.grabOffset.y,
              }}
            />
          ) : null}

          <div className="tray pieces-container" ref={trayRef}>
            {trayPieces.length > 0 ? (
              trayPieces.map((piece) => (
                <div className="tray-item" key={piece.id}>
                  <Piece
                    cellSize={cellSize}
                    className={selectedPieceId === piece.id ? 'is-selected' : ''}
                    onPointerDown={(event) => beginDrag(piece.id, event)}
                    piece={piece}
                    rotation={getPieceRotation(piece.id)}
                  />
                  <div className="tray-label">{piece.name}</div>
                </div>
              ))
            ) : null}
          </div>

          {isComplete ? (
            <div className="completion-overlay">
              <div className="completion-badge">Yay!</div>
              <div className="completion-copy">
                You completed
                <br />
                Puzzle {levelIndex + 1} of {LEVELS.length}:
                <br />
                {currentLevel.name}
              </div>
              {hasNextPuzzle ? (
                <button
                  className="completion-next"
                  onClick={() => goToLevel(levelIndex + 1)}
                  type="button"
                >
                  Play the next puzzle
                </button>
              ) : (
                <div className="completion-done">You finished all puzzles.</div>
              )}
            </div>
          ) : null}
        </div>

        <button
          className={`bubble bubble-rotate rotate-button ${isRotateActive ? 'is-active' : ''} ${isComplete ? 'is-hidden' : ''}`.trim()}
          disabled={!selectedPieceId || isComplete}
          onClick={rotateActivePiece}
          onPointerDown={handleRotateButtonPointerDown}
          type="button"
        >
          Rotate
          <br />
          Piece
        </button>
      </div>

      {isLevelPickerOpen ? (
        <div
          className="picker-backdrop"
          onClick={() => setIsLevelPickerOpen(false)}
          role="presentation"
        >
          <div
            aria-label="Choose a puzzle"
            aria-modal="true"
            className="picker-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="picker-header">
              <div>
                <strong>Choose a Puzzle</strong>
              </div>
              <button onClick={() => setIsLevelPickerOpen(false)} type="button">
                Close
              </button>
            </div>
            <div className="picker-grid">
              {LEVELS.map((level, index) => (
                <button
                  className={index === levelIndex ? 'active' : ''}
                  key={level.id}
                  onClick={() => goToLevel(index)}
                  type="button"
                >
                  <span>{index + 1}</span>
                  <span>{level.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Game;
