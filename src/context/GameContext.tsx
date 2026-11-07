"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type GameMode = '3d-quest' | 'roadmap-24';

export interface GameContextProps {
  activeGame: GameMode;
  setActiveGame: (mode: GameMode) => void;
  completedSteps: number[];
  setCompletedSteps: (steps: number[]) => void;
  userName: string;
  setUserName: (name: string) => void;
  xp: number;
  setXp: (xp: number) => void;
  level: number;
  setLevel: (lvl: number) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const useGame = (): GameContextProps => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within GameProvider');
  }
  return ctx;
};

interface ProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<ProviderProps> = ({ children }) => {
  const [activeGame, setActiveGame] = useState<GameMode>('3d-quest');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userName, setUserName] = useState('Learner');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  return (
    <GameContext.Provider
      value={{
        activeGame,
        setActiveGame,
        completedSteps,
        setCompletedSteps,
        userName,
        setUserName,
        xp,
        setXp,
        level,
        setLevel,
        loading,
        setLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
