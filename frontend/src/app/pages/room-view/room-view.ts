import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import { IdentityService } from '../../services/identity/identity.service';
import { CharacterService } from '../../services/character/character';
import { RoomDetails, Participant, DiceRoll } from '../../models/room';
import { CharacterData } from '../../models/sheet-schema';
import { interval, Subscription, startWith, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-view.html',
  styleUrl: './room-view.scss'
})
export class RoomView implements OnInit, OnDestroy {
  roomId: string | null = null;
  roomDetails: RoomDetails | null = null;
  currentUser: string | null = null;
  userRole: 'GM' | 'Player' | null = null;
  
  // Dice State
  diceInput: string = '';
  
  // Assignment State
  availableDossiers: CharacterData[] = [];
  showAssignModal = false;
  selectedParticipant: Participant | null = null;
  
  private pollSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private identityService: IdentityService,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.identityService.getDisplayName();

    if (!this.roomId || !this.currentUser) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Start 5-second polling
    this.pollSub = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.roomService.getRoomDetails(this.roomId!))
    ).subscribe({
      next: (details) => {
        this.roomDetails = details;
        this.determineRole();
      },
      error: (err) => console.error('Failed to sync room:', err)
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  determineRole() {
    if (!this.roomDetails || !this.currentUser) return;
    const p = this.roomDetails.participants.find(p => p.userName === this.currentUser);
    this.userRole = p ? p.role : null;
  }

  get gmParticipants() {
    return this.roomDetails?.participants.filter(p => p.role === 'GM') || [];
  }

  get playerParticipants() {
    return this.roomDetails?.participants.filter(p => p.role === 'Player') || [];
  }
  
  copyCode() {
    if (this.roomDetails) {
      navigator.clipboard.writeText(this.roomDetails.room.inviteCode);
      alert('CÓDIGO DE CONVITE COPIADO!');
    }
  }

  exitRoom() {
    this.router.navigate(['/dashboard']);
  }

  // --- Dice Logic ---
  quickRoll(sides: number) {
    this.performRoll(`${sides}`);
  }

  handleTerminalCommand() {
    if (!this.diceInput.trim()) return;
    this.performRoll(this.diceInput.trim());
    this.diceInput = '';
  }

  private performRoll(command: string) {
    if (!this.roomId || !this.currentUser) return;

    // Basic dX parser (simple for now: [count]d[sides])
    const regex = /(\d+)?d(\d+)/g;
    let match;
    let total = 0;
    const rolls: number[] = [];

    while ((match = regex.exec(command)) !== null) {
      const count = parseInt(match[1] || '1');
      const sides = parseInt(match[2]);
      for (let i = 0; i < count; i++) {
        const val = Math.floor(Math.random() * sides) + 1;
        rolls.push(val);
        total += val;
      }
    }

    if (rolls.length === 0) return;

    const resultText = `ROLOU ${command}: [${rolls.join(', ')}] = ${total}`;
    
    // GM rolls are private, players are public as requested
    const isPrivate = this.userRole === 'GM';

    this.roomService.saveRoll(this.roomId, {
      userName: this.currentUser,
      diceString: command,
      resultText: resultText,
      isPrivate: isPrivate
    }).subscribe();
  }

  // --- Assignment Logic ---
  openAssignModal(participant: Participant) {
    if (this.userRole !== 'GM') return;
    this.selectedParticipant = participant;
    this.characterService.listAgents().subscribe(data => {
      this.availableDossiers = data;
      this.showAssignModal = true;
    });
  }

  assignCharacter(charId: string) {
    if (!this.roomId || !this.selectedParticipant) return;
    this.roomService.assignCharacter(this.roomId, this.selectedParticipant.userName, charId).subscribe(() => {
      this.showAssignModal = false;
      this.selectedParticipant = null;
    });
  }

  getVisibleRolls() {
    if (!this.roomDetails || !this.roomDetails.rolls) return [];
    return this.roomDetails.rolls.filter(r => !r.isPrivate || r.userName === this.currentUser || this.userRole === 'GM');
  }

  openCharacter(p: Participant) {
    if (!p.characterId) return;
    this.router.navigate(['/recrutamento'], { queryParams: { id: p.characterId } });
  }

  getAssignedCharacterName(charId?: string) {
    // Ideally we'd have a map of charId -> Name
    return charId ? 'AGENTE VINCULADO' : 'SEM FICHA';
  }
}
