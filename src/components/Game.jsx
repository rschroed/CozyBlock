import { useEffect, useMemo, useRef, useState } from 'react';
import { createLevelPieceInstances, LEVELS } from '../data/levels';
import { getLevelNavigation, getLevelPickerSections } from '../data/levels/navigation';
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

function createInitialTrayRotations(levelPieces) {
  return Object.fromEntries(levelPieces.map((piece) => [piece.id, 0]));
}

function createBlockedModalState(target, source) {
  if (!target || target.blockedAction === 'none') {
    return null;
  }

  return {
    targetSetId: target.setId,
    targetSetName: target.setName,
    source,
    action: target.blockedAction,
  };
}

function Game() {
  const hasPremium = false;
  const boardRef = useRef(null);
  const trayRef = useRef(null);
  const dragStateRef = useRef(null);
  const placedPiecesRef = useRef({});
  const currentLevelRef = useRef(LEVELS[0]);
  const currentLevelPiecesRef = useRef(createLevelPieceInstances(LEVELS[0]));
  const currentPieceMapRef = useRef(
    Object.fromEntries(createLevelPieceInstances(LEVELS[0]).map((piece) => [piece.id, piece])),
  );
  const cellSizeRef = useRef(DESKTOP_CELL_SIZE);
  const [levelIndex, setLevelIndex] = useState(0);
  const [placedPieces, setPlacedPieces] = useState({});
  const [trayRotations, setTrayRotations] = useState(
    createInitialTrayRotations(createLevelPieceInstances(LEVELS[0])),
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [isLevelPickerOpen, setIsLevelPickerOpen] = useState(false);
  const [blockedModalState, setBlockedModalState] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === 'undefined' ? 1024 : window.innerWidth,
  );
  const currentLevel = LEVELS[levelIndex];
  const navigation = useMemo(
    () => getLevelNavigation(levelIndex, { hasPremium }),
    [hasPremium, levelIndex],
  );
  const pickerSections = useMemo(() => getLevelPickerSections({ hasPremium }), [hasPremium]);
  const currentLevelPieces = useMemo(() => createLevelPieceInstances(currentLevel), [currentLevel]);
  const pieceMap = useMemo(
    () => Object.fromEntries(currentLevelPieces.map((piece) => [piece.id, piece])),
    [currentLevelPieces],
  );
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
    currentLevelPiecesRef.current = currentLevelPieces;
  }, [currentLevelPieces]);

  useEffect(() => {
    currentPieceMapRef.current = pieceMap;
  }, [pieceMap]);

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
      currentLevelPiecesRef.current,
      placedPiecesRef.current,
      currentPieceMapRef.current[pieceId],
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
    const levelPieces = createLevelPieceInstances(level);
    updateDragState(null);
    setPlacedPieces({});
    setTrayRotations(createInitialTrayRotations(levelPieces));
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
    setBlockedModalState(null);
  };

  const openBlockedModal = (target, source) => {
    const nextBlockedModalState = createBlockedModalState(target, source);

    if (!nextBlockedModalState) {
      return;
    }

    setIsLevelPickerOpen(false);
    setBlockedModalState(nextBlockedModalState);
  };

  const closeBlockedModal = () => {
    setBlockedModalState(null);
  };

  const showRestorePlaceholder = () => {
    setBlockedModalState((currentBlockedModalState) =>
      currentBlockedModalState ? { ...currentBlockedModalState, action: 'show_restore' } : null,
    );
  };

  const showPurchasePlaceholder = () => {
    setBlockedModalState((currentBlockedModalState) =>
      currentBlockedModalState ? { ...currentBlockedModalState, action: 'show_purchase' } : null,
    );
  };

  const handleLevelPickerSelection = (level) => {
    if (!level.isAccessible) {
      openBlockedModal(level, 'picker');
      return;
    }

    goToLevel(level.levelIndex);
  };

  const handleNextPuzzle = () => {
    if (!navigation?.nextTarget) {
      return;
    }

    if (!navigation.nextTarget.isAccessible) {
      openBlockedModal(navigation.nextTarget, 'next_level');
      return;
    }

    goToLevel(navigation.nextTarget.levelIndex);
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
        if (blockedModalState) {
          closeBlockedModal();
          return;
        }

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
  }, [blockedModalState]);

  const hasAnyPlacedPieces = Object.keys(placedPieces).length > 0;
  const hasNextPuzzle = navigation?.nextTarget !== null;
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
              <span className="puzzle-trigger-set">{navigation.setName}</span>
              <span className="puzzle-trigger-level">
                Puzzle {navigation.localLevelNumber} of {navigation.localLevelCount}: {currentLevel.name}
              </span>
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
                {navigation.crossesIntoNextSet ? (
                  <>
                    You finished
                    <br />
                    {navigation.setName}
                  </>
                ) : (
                  <>
                    You completed
                    <br />
                    {navigation.setName}
                    <br />
                    Puzzle {navigation.localLevelNumber} of {navigation.localLevelCount}:
                    <br />
                    {currentLevel.name}
                  </>
                )}
              </div>
              {hasNextPuzzle ? (
                <button
                  className="completion-next"
                  onClick={handleNextPuzzle}
                  type="button"
                >
                  {navigation.crossesIntoNextSet
                    ? `Start ${navigation.nextSet.name}`
                    : 'Play the next puzzle'}
                </button>
              ) : (
                <div className="completion-done">You finished all worlds.</div>
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
            <div className="picker-sections">
              {pickerSections.map((section) => (
                <section className="picker-section" key={section.setId}>
                  <div className="picker-section-header">
                    <strong>{section.setName}</strong>
                    <span>{section.levels.length} puzzles</span>
                  </div>
                  <div className="picker-grid">
                    {section.levels.map((level) => (
                      <button
                        aria-disabled={!level.isAccessible}
                        className={[
                          level.levelIndex === levelIndex ? 'active' : '',
                          !level.isAccessible ? 'is-locked' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        key={level.level.id}
                        onClick={() => handleLevelPickerSelection(level)}
                        type="button"
                      >
                        <span className="picker-grid-meta">
                          <span>Puzzle {level.localLevelNumber}</span>
                          {!level.isAccessible ? (
                            <span className="picker-premium-badge">Premium</span>
                          ) : null}
                        </span>
                        <span>{level.level.name}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {blockedModalState ? (
        <div className="picker-backdrop" onClick={closeBlockedModal} role="presentation">
          <div
            aria-label="Premium content locked"
            aria-modal="true"
            className="blocked-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="picker-header">
              <div>
                <strong>Premium Content</strong>
              </div>
              <button onClick={closeBlockedModal} type="button">
                Close
              </button>
            </div>

            {blockedModalState.action === 'show_restore' ? (
              <div className="blocked-dialog-body">
                <p className="blocked-dialog-copy">
                  Restore for {blockedModalState.targetSetName} is coming next. This placeholder
                  confirms the locked flow without wiring the real restore form yet.
                </p>
                <button className="blocked-dialog-primary" onClick={showPurchasePlaceholder} type="button">
                  Back to premium details
                </button>
              </div>
            ) : (
              <div className="blocked-dialog-body">
                <div className="blocked-dialog-kicker">
                  {blockedModalState.source === 'next_level' ? 'Next world locked' : 'Locked from picker'}
                </div>
                <p className="blocked-dialog-copy">
                  {blockedModalState.targetSetName} is premium content. Buying and restore are not wired in
                  yet, but this placeholder blocks entry and keeps the locked-state behavior visible.
                </p>
                <button className="blocked-dialog-primary" type="button">
                  Buy placeholder
                </button>
                <button className="blocked-dialog-secondary" onClick={showRestorePlaceholder} type="button">
                  Restore placeholder
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Game;
