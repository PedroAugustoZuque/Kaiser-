export type OrdemAttribute = 'AGI' | 'FOR' | 'INT' | 'PRE' | 'VIG';

export interface OrdemSkillDefinition {
  id: string;
  name: string;
  baseAttribute: OrdemAttribute;
  trainedOnly: boolean;
  loadPenalty: boolean;
}

export interface OrdemClassBase {
  id: string;
  name: string;
  initialPV: number;
  gainPV: number;
  initialSAN: number;
  gainSAN: number;
  initialPE: number;
  gainPE: number;
  initialAbilities: string[];
}

export type OrdemSource = 'core' | 'sobrevivendo_ao_horror' | 'arquivos_secretos';

export type OrdemElement = 'Sangue' | 'Morte' | 'Conhecimento' | 'Energia' | 'Medo';

export interface OrdemRitual {
  id: string;
  name: string;
  element: OrdemElement[];
  circle: 1 | 2 | 3 | 4;
  execution: string;
  range: string;
  target: string;
  duration: string;
  resistance?: string;
  description: string;
}

export interface OrdemTrilha {
  id: string;
  name: string;
  classId: string;
  source: OrdemSource;
  summary: string;
  unlocks: { nex: number; ability: string }[];
}

export interface OrdemCharacterResources {
  pv_current: number;
  pv_max: number;
  san_current: number;
  san_max: number;
  pe_current: number;
  pe_max: number;
  pe_per_round: number;
  deslocamento: number;
  defesa: number;
  dt_rituais: number;
}

export interface OrdemSkillValue {
  id: string;
  training: 0 | 5 | 10 | 15;
  otherMods: number;
}

export interface OrdemCharacterData {
  name: string;
  player: string;
  originId: string;
  classId: string;
  trilhaId: string;
  nex: number;
  attributes: Record<OrdemAttribute, number>;
  resources: OrdemCharacterResources;
  skills: OrdemSkillValue[];
  attacks: any[];
  inventory: any;
  rituals: OrdemRitual[];
  abilities: string[];
  equipment: any[];
  description: {
    appearance: string;
    personality: string;
    history: string;
    objective: string;
  };
}
