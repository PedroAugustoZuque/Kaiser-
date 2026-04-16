import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, RoomDetails, DiceRoll, MapState } from '../../models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://10.0.110.7:8080/api/v1/rooms';

  constructor(private http: HttpClient) {}

  listUserRooms(userName: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}?userName=${userName}`);
  }

  getRoomDetails(id: string): Observable<RoomDetails> {
    return this.http.get<RoomDetails>(`${this.apiUrl}/${id}`);
  }

  createRoom(name: string, gmName: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name, gmName, system: 'ordem-paranormal' });
  }

  joinRoom(inviteCode: string, userName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/join`, { inviteCode, userName });
  }

  assignCharacter(roomId: string, userName: string, characterId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${roomId}/assign`, { userName, characterId });
  }

  saveRoll(roomId: string, roll: Partial<DiceRoll>): Observable<DiceRoll> {
    return this.http.post<DiceRoll>(`${this.apiUrl}/${roomId}/roll`, roll);
  }

  updateMapState(roomId: string, map: MapState): Observable<any> {
    return this.http.put(`${this.apiUrl}/${roomId}/map`, map);
  }
}

