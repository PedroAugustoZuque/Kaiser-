import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, RoomDetails } from '../../models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8080/api/v1/rooms';

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

  saveRoll(roomId: string, roll: Partial<any>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${roomId}/roll`, roll);
  }
}
