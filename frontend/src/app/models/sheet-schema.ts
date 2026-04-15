export type FieldType = 'number' | 'text' | 'boolean' | 'longtext' | 'select' | 'multiselect';

export interface SheetField {
  id: string; // The unique internal key (e.g., 'str', 'dex', 'hp')
  label: string; // The human-readable name (e.g., 'Strength', 'Dexterity', 'Hit Points')
  type: FieldType;
  defaultValue?: any;
  minValue?: number;
  maxValue?: number;
  options?: { label: string; value: any }[];
}

export interface SheetSection {
  id: string;
  title: string; // e.g., 'Base Attributes', 'Skills', 'Combat Stats'
  layout: 'grid' | 'list' | 'row'; // how fields should be arranged visually
  fields: SheetField[];
}

export interface SheetSchema {
  id: string; // the system ID (e.g., 'dnd5e', 'coc7', 'tormenta20')
  name: string; // e.g., 'D&D 5e Character Sheet'
  sections: SheetSection[];
}

export interface CharacterData {
  id: string;
  name: string;
  systemId: string; // Links back to a SheetSchema
  portraitUrl?: string;
  fieldsData: Record<string, any>; // Stores the dynamic field values { 'str': 16, 'hp': { current: 12, max: 20 } }
}
