import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import { IdentityService } from '../../services/identity/identity.service';
import { CharacterService } from '../../services/character/character';
import { RoomDetails, Participant, DiceRoll, Token, MapState } from '../../models/room';
import { CharacterSheetData } from '../../models/sheet-schema';

import { interval, Subscription, startWith, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { VttMap } from '../../components/vtt-map/vtt-map';
import { DynamicSheet } from '../../components/dynamic-sheet/dynamic-sheet';
import { ORDEM_PARANORMAL_SCHEMA } from '../../models/ordem-paranormal.schema';


@Component({
  selector: 'app-room-view',
  standalone: true,
  imports: [CommonModule, FormsModule, VttMap, DynamicSheet],
  templateUrl: './room-view.html',
  styleUrl: './room-view.scss'
})
export class RoomView implements OnInit, OnDestroy {
  roomId: string | null = null;
  roomDetails: RoomDetails | null = null;
  currentUser: string | null = null;
  userRole: 'GM' | 'Player' | null = null;
  
  ordemSchema = ORDEM_PARANORMAL_SCHEMA;

  // VTT Config
  gridSizes = [35, 50, 70, 100, 140, 200];
  showMapConfig = false;

  // Sheet Panel State
  showSheetPanel = false;
  activeParticipantSheet: CharacterSheetData | null = null;

  
  selectedBonus = 0;


  
  // Dice State

  diceInput: string = '';
  
  // Assignment State
  availableDossiers: CharacterSheetData[] = [];

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
    const sign = this.selectedBonus >= 0 ? '+' : '';
    const cmd = `1d${sides}${this.selectedBonus !== 0 ? sign + this.selectedBonus : ''}`;
    this.performRoll(cmd);
  }


  handleTerminalCommand() {
    if (!this.diceInput.trim()) return;
    this.performRoll(this.diceInput.trim());
    this.diceInput = '';
  }

  private performRoll(command: string, label?: string) {
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

    const resultText = label ? `TESTE DE ${label.toUpperCase()}: ${command} -> [${rolls.join(', ')}] = ${total}` : `ROLOU ${command}: [${rolls.join(', ')}] = ${total}`;
    
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

  // --- VTT Sync ---
  syncMap() {
    if (!this.roomId || !this.roomDetails || this.userRole !== 'GM') return;
    this.roomService.updateMapState(this.roomId, this.roomDetails.map).subscribe();
  }

  onTokenMoved(token: Token) {
    if (!this.roomId || !this.roomDetails) return;
    
    // Update local state first for responsiveness
    const idx = this.roomDetails.map.tokens.findIndex(t => t.id === token.id);
    if (idx !== -1) {
      this.roomDetails.map.tokens[idx] = token;
    }

    // Sync to server if allowed
    if (this.userRole === 'GM' || token.type === 'agent') {
      this.syncMap();
    }
  }

  addToken(name: string, type: any) {
    if (!name || !this.roomDetails) return;
    
    const newToken: Token = {
      id: 'token-' + Date.now(),
      name: name,
      type: type,
      x: 100, y: 100, // Default drop position
      size: 1,
      portraitUrl: '', // Default placeholder
      currentHp: 10,
      maxHp: 10,
      isVisible: true
    };

    if (!this.roomDetails.map.tokens) {
      this.roomDetails.map.tokens = [];
    }

    this.roomDetails.map.tokens.push(newToken);
    this.syncMap();
  }

  openCharacter(p: Participant) {
    if (!p.characterId) return;
    
    this.characterService.getAgent(p.characterId).subscribe(agent => {
      this.activeParticipantSheet = agent;
      this.showSheetPanel = true;
    });
  }

  onSheetRoll(event: { field: string, value: any }) {
    // If value is a number, we assume it's an attribute/skill to roll d20 + value
    const bonus = typeof event.value === 'number' ? event.value : 0;
    const diceCommand = `1d20${bonus >= 0 ? '+' : ''}${bonus}`;
    this.performRoll(diceCommand, event.field);
  }


  getAssignedCharacterName(charId?: string) {
    return charId ? 'AGENTE VINCULADO' : '';
  }
}

