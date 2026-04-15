import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CharacterData } from '../../models/sheet-schema';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'http://localhost:8080/api/v1/agents';

  constructor(private http: HttpClient) {}

  /**
   * List all saved agents
   */
  listAgents(): Observable<CharacterData[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(agents => agents.map(a => this.mapToFrontend(a)))
    );
  }

  /**
   * Get a single agent by ID
   */
  getAgent(id: string): Observable<CharacterData> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(a => this.mapToFrontend(a))
    );
  }

  /**
   * Save (Create or Update) an agent
   */
  saveAgent(char: CharacterData): Observable<any> {
    const backendAgent = this.mapToBackend(char);
    return this.http.post(this.apiUrl, backendAgent);
  }

  /**
   * Delete an agent
   */
  deleteAgent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // --- Mappers ---

  private mapToFrontend(backend: any): CharacterData {
    return {
      id: backend.id,
      name: backend.name,
      systemId: backend.systemId || 'ordem-paranormal',
      portraitUrl: backend.portraitUrl,
      fieldsData: backend.fieldsData ? JSON.parse(backend.fieldsData) : {}
    };
  }

  private mapToBackend(frontend: CharacterData): any {
    return {
      id: frontend.id,
      name: frontend.name,
      player: 'Agente', // Default for now
      originId: frontend.fieldsData['origin'] || '',
      classId: frontend.fieldsData['class'] || 'combatente',
      trilhaId: frontend.fieldsData['trilha'] || '',
      nex: frontend.fieldsData['nex'] || 5,
      portraitUrl: frontend.portraitUrl,
      fieldsData: JSON.stringify(frontend.fieldsData)
    };
  }
}
