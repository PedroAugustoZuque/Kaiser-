export interface Room {
  id: string;
  name: string;
  gmName: string;
  inviteCode: string;
  createdAt: string;
}

export interface Participant {
  roomId: string;
  userName: string;
  role: 'GM' | 'Player';
  characterId?: string;
}

export interface DiceRoll {
  id: string;
  roomId: string;
  userName: string;
  diceString: string;
  resultText: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface Token {
  id: string;
  name: string;
  type: 'agent' | 'monster' | 'item';
  x: number;
  y: number;
  size: number;
  portraitUrl: string;
  currentHp: number;
  maxHp: number;
  isVisible: boolean;
}

export interface MapState {
  roomId: string;
  background: string;
  gridSize: number;
  gridColor: string;
  opacity: number;
  offsetX: number;
  offsetY: number;
  zoom: number;
  tokens: Token[];
}

export interface RoomDetails {
  room: Room;
  participants: Participant[];
  rolls: DiceRoll[];
  map: MapState;
}
