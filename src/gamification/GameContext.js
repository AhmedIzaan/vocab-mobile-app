import React, { createContext, useContext } from 'react';
import { useGameState } from './useGameState';

const GameContext = createContext();

export function GameProvider({ children }) {
  const game = useGameState();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export const useGame = () => useContext(GameContext);
