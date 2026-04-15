import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicSheet } from '../../components/dynamic-sheet/dynamic-sheet';
import { SheetSchema, CharacterData } from '../../models/sheet-schema';
import { ORDEM_PARANORMAL_SCHEMA } from '../../models/ordem-paranormal.schema';
import { CLASSES, TRILHAS, RITUAIS } from '../../models/ordem-paranormal.data';
import { CharacterService } from '../../services/character/character';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicSheet],
  templateUrl: './characters.html',
  styleUrl: './characters.scss'
})
export class Characters implements OnInit {
  
  availableSchemas: SheetSchema[] = [
    ORDEM_PARANORMAL_SCHEMA
  ];

  selectedSchemaId: string = 'ordem-paranormal';

  currentCharacter: CharacterData = {
    id: 'char-' + Date.now(),
    name: 'Herói Sem Nome',
    systemId: 'ordem-paranormal',
    portraitUrl: '',
    fieldsData: {}
  };

  isSaving = false;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if we are editing an existing agent
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.characterService.getAgent(id).subscribe({
          next: (agent) => {
            this.currentCharacter = agent;
            this.selectedSchemaId = agent.systemId;
            if (this.selectedSchemaId === 'ordem-paranormal') {
              this.applyOrdemParanormalLogic();
            }
          },
          error: (err) => {
            console.error('Failed to load agent for editing:', err);
          }
        });
      }
    });
  }

  get activeSchema(): SheetSchema {
    return this.availableSchemas.find(s => s.id === this.selectedSchemaId) || this.availableSchemas[0];
  }

  onSystemChange() {
    this.currentCharacter = {
      ...this.currentCharacter,
      systemId: this.selectedSchemaId,
      fieldsData: {}
    };
  }

  onDataChanged(newData: Record<string, any>) {
    // Update data
    this.currentCharacter.fieldsData = { ...newData };
    
    // Apply Ordem-specific sheet logic
    if (this.selectedSchemaId === 'ordem-paranormal') {
      this.applyOrdemParanormalLogic();
    }
  }

  private applyOrdemParanormalLogic() {
    const data = this.currentCharacter.fieldsData;
    const schema = this.activeSchema;
    
    // 1. Filter Trilhas based on Class
    const selectedClassId = data['class'];
    const trilhaField = this.findField(schema, 'trilha');
    
    if (trilhaField) {
      const filteredTrilhas = TRILHAS.filter(t => !selectedClassId || t.classId === selectedClassId);
      trilhaField.options = filteredTrilhas.map(t => ({ label: t.name, value: t.id }));
      
      // Reset selected trilha if it's no longer valid
      if (data['trilha'] && !filteredTrilhas.some(t => t.id === data['trilha'])) {
        data['trilha'] = '';
      }
    }

    // 2. Filter Rituals based on NEX (Circle)
    const nex = data['nex'] || 0;
    let maxCircle = 1;
    if (nex >= 99) maxCircle = 4;
    else if (nex >= 65) maxCircle = 3;
    else if (nex >= 35) maxCircle = 2;
    
    const ritualsField = this.findField(schema, 'rituais');
    if (ritualsField) {
      const filteredRituals = RITUAIS.filter(r => r.circle <= maxCircle);
      ritualsField.options = filteredRituals.map(r => ({ 
        label: `[${r.circle}º] ${r.name} (${r.element.join('/')})`, 
        value: r.id 
      }));

      // Categorize options if possible (simple labels)
      // Note: Full element-based grouping would require a more complex 'select' UI, 
      // but we can sort them here.
      ritualsField.options.sort((a, b) => a.label.localeCompare(b.label));

      // Remove rituals that are now above the current circle
      if (Array.isArray(data['rituais'])) {
        data['rituais'] = data['rituais'].filter(ritualId => 
          filteredRituals.some(r => r.id === ritualId)
        );
      }
    }
  }

  private findField(schema: SheetSchema, fieldId: string) {
    for (const section of schema.sections) {
      const field = section.fields.find(f => f.id === fieldId);
      if (field) return field;
    }
    return null;
  }

  saveCurrentAgent() {
    this.isSaving = true;
    this.characterService.saveAgent(this.currentCharacter).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Dossiê sincronizado com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to save dossier:', err);
        alert('Erro ao sincronizar dossiê. Verifique a conexão com o CRIS.');
      }
    });
  }

  onDiscard() {
    if (confirm('Deseja realmente descartar as alterações e voltar ao terminal?')) {
      this.router.navigate(['/dashboard']);
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentCharacter = {
          ...this.currentCharacter,
          portraitUrl: e.target.result
        };
      };
      reader.readAsDataURL(file);
    }
  }
}
