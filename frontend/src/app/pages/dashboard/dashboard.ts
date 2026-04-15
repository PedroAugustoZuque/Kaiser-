import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character/character';
import { IdentityService } from '../../services/identity/identity.service';
import { RoomService } from '../../services/room/room.service';
import { CharacterData } from '../../models/sheet-schema';
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
  agents: CharacterData[] = [];
  rooms: Room[] = [];
  loading = true;
  
  // Identity State
  userName: string | null = null;
  tempName: string = '';
  
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
    } else {
      this.loading = false;
    }
  }

  saveIdentity() {
    if (this.tempName.trim()) {
      this.identityService.setDisplayName(this.tempName.trim());
      this.userName = this.tempName.trim();
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
      this.roomService.createRoom(this.newRoomName.trim(), this.userName).subscribe(res => {
        this.showCreateModal = false;
        this.newRoomName = '';
        this.loadRooms(this.userName!);
        this.router.navigate(['/sessao', res.id]);
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
        error: () => alert('Código inválido ou expirado.')
      });
    }
  }

  onRoomClick(room: Room) {
    this.router.navigate(['/sessao', room.id]);
  }

  loadAgents() {
    this.loading = true;
    this.characterService.listAgents().subscribe({
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

  onAgentDoubleClick(agent: CharacterData) {
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
