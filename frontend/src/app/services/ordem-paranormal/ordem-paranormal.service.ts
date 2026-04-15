import { Injectable } from '@angular/core';
import { CLASSES, SKILLS } from '../../models/ordem-paranormal.data';
import { OrdemAttribute, OrdemCharacterData, OrdemCharacterResources } from '../../models/ordem-paranormal.models';

@Injectable({
  providedIn: 'root'
})
export class OrdemParanormalService {

  /**
   * Calculates the level (multiplier for level-up gains)
   * In Ordem Paranormal, NEX 5% is level 1, 10% is level 2, etc. (NEX / 5)
   */
  private getLevel(nex: number): number {
    return Math.floor(nex / 5);
  }

  /**
   * Calculates current max resources based on class, NEX, and attributes
   */
  calculateResources(char: Partial<OrdemCharacterData>): OrdemCharacterResources {
    const nex = char.nex || 5;
    const classBase = CLASSES.find(c => c.id === char.classId) || CLASSES[0];
    const attributes = char.attributes || { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 };
    
    const level = this.getLevel(nex);
    const levelGains = level - 1;

    // Formulas:
    // PV = InitialPV + Vigor + (LevelGains * (GainPV + Vigor))
    const maxPV = classBase.initialPV + attributes.VIG + (levelGains * (classBase.gainPV + attributes.VIG));
    
    // SAN = InitialSAN + (LevelGains * GainSAN)
    const maxSAN = classBase.initialSAN + (levelGains * classBase.gainSAN);
    
    // PE = InitialPE + Presence + (LevelGains * (GainPE + Presence))
    const maxPE = classBase.initialPE + attributes.PRE + (levelGains * (classBase.gainPE + attributes.PRE));

    // PE per Round = NEX / 5 (Simplified or per character tier)
    const pePerRound = level;

    // Defense = 10 + Agility + items (here we only calculate the base part)
    const baseDefense = 10 + attributes.AGI;

    return {
      pv_current: maxPV,
      pv_max: maxPV,
      san_current: maxSAN,
      san_max: maxSAN,
      pe_current: maxPE,
      pe_max: maxPE,
      pe_per_round: pePerRound,
      deslocamento: 9, // standard base
      defesa: baseDefense,
      dt_rituais: 10 + level + attributes.PRE // simplified base formula
    };
  }

  /**
   * Calculates the total bonus for a specific skill
   */
  calculateSkillBonus(skillId: string, char: OrdemCharacterData): number {
    const skillDef = SKILLS.find(s => s.id === skillId);
    if (!skillDef) return 0;

    const skillVal = char.skills.find(s => s.id === skillId);
    const trainingBonus = skillVal ? skillVal.training : 0;
    const otherMods = skillVal ? skillVal.otherMods : 0;
    
    // Total = Training + Other Mods (Attribute is used for number of dice, not bonus)
    // However, some variants sum the attribute. In OP, Bonus is just training + extras.
    return trainingBonus + otherMods;
  }
}
