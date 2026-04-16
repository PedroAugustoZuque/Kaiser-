import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character/character';
import { IdentityService } from '../../services/identity/identity.service';
import { RoomService } from '../../services/room/room.service';
import { CharacterSheetData } from '../../models/sheet-schema';

import { Room } from '../../models/room';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  agents: CharacterSheetData[] = [];

  rooms: Room[] = [];
  loading = true;
  
  // Identity State
  // Identity State
  userName: string | null = null;
  
  // Room Modals/Inputs
  showCreateModal = false;
  showJoinModal = false;
  newRoomName: string = '';
  inviteCodeInput: string = '';
  
  constructor(
    private characterService: CharacterService,
    private identityService: IdentityService,
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = this.identityService.getDisplayName();
    if (this.userName) {
      this.loadAll();
    }
  }

  loadAll() {
    this.loading = true;
    this.loadAgents();
    if (this.userName) {
      this.loadRooms(this.userName);
    }
  }


  loadRooms(user: string) {
    this.roomService.listUserRooms(user).subscribe(data => {
      this.rooms = data;
    });
  }

  createRoom() {
    if (this.newRoomName.trim() && this.userName) {
      this.roomService.createRoom(this.newRoomName.trim(), this.userName).subscribe({
        next: (res) => {
          this.showCreateModal = false;
          this.newRoomName = '';
          this.loadRooms(this.userName!);
          this.router.navigate(['/sessao', res.id]);
        },
        error: (err) => {
          console.error(err);
          alert('FALHA NA OPERAÇÃO: Não foi possível criar a mesa. Verifique a conexão com o terminal.');
        }
      });
    }
  }

  joinRoom() {
    if (this.inviteCodeInput.trim() && this.userName) {
      this.roomService.joinRoom(this.inviteCodeInput.trim(), this.userName).subscribe({
        next: (res) => {
          this.showJoinModal = false;
          this.inviteCodeInput = '';
          this.loadRooms(this.userName!);
          this.router.navigate(['/sessao', res.id]);
        },
        error: (err) => {
          console.error(err);
          alert('CÓDIGO DE ACESSO INVÁLIDO: Decodificação falhou ou permissão negada.');
        }
      });
    }
  }


  onRoomClick(room: Room) {
    this.router.navigate(['/sessao', room.id]);
  }

  loadAgents() {
    this.loading = true;
    this.characterService.listAgents(this.userName || undefined).subscribe({
      next: (data) => {

        this.agents = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load agents:', err);
        this.loading = false;
      }
    });
  }

  onAgentDoubleClick(agent: CharacterSheetData) {

    // Navigate to character creator with the agent ID as a parameter
    this.router.navigate(['/recrutamento'], { queryParams: { id: agent.id } });
  }

  deleteAgent(id: string, event: Event) {
    event.stopPropagation(); // Prevent double-click trigger
    if (confirm('Deseja realmente deletar este dossiê?')) {
      this.characterService.deleteAgent(id).subscribe(() => this.loadAgents());
    }
  }
}
