import { CARDS } from '../data/cards';

export type Screen = 'home' | 'game' | 'result';
export type Mode = 'sprint' | 'survival' | 'daily';
export type Answer = 'right' | 'wrong' | null;

export const MAX_LIVES = 3;

export type GameState = {
  screen: Screen;
  mode: Mode;
  index: number;
  score: number;
  combo: number;
  bestCombo: number;
  lives: number;
  correct: number;
  answeredCount: number;
  answered: Answer;
  lastPoints: number;
};

export type GameAction =
  | { type: 'setMode'; mode: Mode }
  | { type: 'start' }
  | { type: 'answer'; saysValid: boolean }
  | { type: 'next' }
  | { type: 'goHome' };

export const initialGameState: GameState = {
  screen: 'home',
  mode: 'survival',
  index: 0,
  score: 0,
  combo: 0,
  bestCombo: 0,
  lives: MAX_LIVES,
  correct: 0,
  answeredCount: 0,
  answered: null,
  lastPoints: 0,
};

/** x1, then x2 from a combo of 2, x3 from a combo of 4. */
export function multiplier(combo: number): number {
  return combo >= 4 ? 3 : combo >= 2 ? 2 : 1;
}

export function isLastCard(state: GameState): boolean {
  return state.index === CARDS.length - 1 || state.lives <= 0;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'setMode':
      return { ...state, mode: action.mode };

    case 'start':
      return { ...initialGameState, mode: state.mode, screen: 'game' };

    case 'answer': {
      if (state.answered) return state;
      const ok = CARDS[state.index].valid === action.saysValid;
      const points = ok ? 100 * multiplier(state.combo) : 0;
      const combo = ok ? state.combo + 1 : 0;
      return {
        ...state,
        answered: ok ? 'right' : 'wrong',
        lastPoints: points,
        score: state.score + points,
        combo,
        bestCombo: Math.max(state.bestCombo, combo),
        lives: ok ? state.lives : state.lives - 1,
        correct: state.correct + (ok ? 1 : 0),
        answeredCount: state.answeredCount + 1,
      };
    }

    case 'next':
      if (isLastCard(state)) return { ...state, screen: 'result', answered: null };
      return { ...state, index: state.index + 1, answered: null };

    case 'goHome':
      return { ...state, screen: 'home', answered: null };

    default:
      return state;
  }
}
