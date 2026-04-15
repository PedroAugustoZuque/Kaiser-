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

export interface RoomDetails {
  room: Room;
  participants: Participant[];
  rolls: DiceRoll[];
}
