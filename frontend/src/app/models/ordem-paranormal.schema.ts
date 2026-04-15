import { SheetSchema } from './sheet-schema';
import { CLASSES, TRILHAS, RITUAIS } from './ordem-paranormal.data';

export const ORDEM_PARANORMAL_SCHEMA: SheetSchema = {
  id: 'ordem-paranormal',
  name: 'Ordem Paranormal',
  sections: [
    {
      id: 'header',
      title: 'Informações Básicas',
      layout: 'grid',
      fields: [
        { id: 'name', label: 'Nome do Agente', type: 'text' },
        { id: 'player', label: 'Jogador', type: 'text' },
        { id: 'origin', label: 'Origem', type: 'text' },
        { 
          id: 'class', 
          label: 'Classe', 
          type: 'select',
          options: CLASSES.map(c => ({ label: c.name, value: c.id }))
        },
        { 
          id: 'trilha', 
          label: 'Trilha', 
          type: 'select',
          options: TRILHAS.map(t => ({ label: t.name, value: t.id }))
        },
        { id: 'nex', label: 'NEX', type: 'number', defaultValue: 5, minValue: 0, maxValue: 99 },
        { id: 'patente', label: 'Patente', type: 'text' },
      ]
    },
    {
      id: 'attributes',
      title: 'Atributos',
      layout: 'row',
      fields: [
        { id: 'agi', label: 'AGI', type: 'number', defaultValue: 1, minValue: 0, maxValue: 5 },
        { id: 'for', label: 'FOR', type: 'number', defaultValue: 1, minValue: 0, maxValue: 5 },
        { id: 'int', label: 'INT', type: 'number', defaultValue: 1, minValue: 0, maxValue: 5 },
        { id: 'pre', label: 'PRE', type: 'number', defaultValue: 1, minValue: 0, maxValue: 5 },
        { id: 'vig', label: 'VIG', type: 'number', defaultValue: 1, minValue: 0, maxValue: 5 },
      ]
    },
    {
      id: 'resources',
      title: 'Recursos e Status',
      layout: 'grid',
      fields: [
        { id: 'pv_max', label: 'PV Máximo', type: 'number' },
        { id: 'pv_current', label: 'PV Atual', type: 'number' },
        { id: 'san_max', label: 'SAN Máxima', type: 'number' },
        { id: 'san_current', label: 'SAN Atual', type: 'number' },
        { id: 'pe_max', label: 'PE Máximo', type: 'number' },
        { id: 'pe_current', label: 'PE Atual', type: 'number' },
        { id: 'defesa', label: 'Defesa', type: 'number' },
        { id: 'deslocamento', label: 'Deslocamento', type: 'number', defaultValue: 9 },
        { id: 'pe_rodada', label: 'PE / Rodada', type: 'number' },
      ]
    },
    {
      id: 'skills',
      title: 'Perícias',
      layout: 'grid',
      fields: [
        { id: 'acrobacia', label: 'Acrobacia', type: 'number', defaultValue: 0 },
        { id: 'crime', label: 'Crime', type: 'number', defaultValue: 0 },
        { id: 'furtividade', label: 'Furtividade', type: 'number', defaultValue: 0 },
        { id: 'iniciativa', label: 'Iniciativa', type: 'number', defaultValue: 0 },
        { id: 'pilotagem', label: 'Pilotagem', type: 'number', defaultValue: 0 },
        { id: 'pontaria', label: 'Pontaria', type: 'number', defaultValue: 0 },
        { id: 'reflexos', label: 'Reflexos', type: 'number', defaultValue: 0 },
        { id: 'atletismo', label: 'Atletismo', type: 'number', defaultValue: 0 },
        { id: 'luta', label: 'Luta', type: 'number', defaultValue: 0 },
        { id: 'atualidades', label: 'Atualidades', type: 'number', defaultValue: 0 },
        { id: 'ciencias', label: 'Ciências', type: 'number', defaultValue: 0 },
        { id: 'investigacao', label: 'Investigação', type: 'number', defaultValue: 0 },
        { id: 'medicina', label: 'Medicina', type: 'number', defaultValue: 0 },
        { id: 'ocultismo', label: 'Ocultismo', type: 'number', defaultValue: 0 },
        { id: 'profissao', label: 'Profissão', type: 'number', defaultValue: 0 },
        { id: 'sobrevivencia', label: 'Sobrevivência', type: 'number', defaultValue: 0 },
        { id: 'tatica', label: 'Tática', type: 'number', defaultValue: 0 },
        { id: 'tecnologia', label: 'Tecnologia', type: 'number', defaultValue: 0 },
        { id: 'adestramento', label: 'Adestramento', type: 'number', defaultValue: 0 },
        { id: 'artes', label: 'Artes', type: 'number', defaultValue: 0 },
        { id: 'diplomacia', label: 'Diplomacia', type: 'number', defaultValue: 0 },
        { id: 'enganacao', label: 'Enganação', type: 'number', defaultValue: 0 },
        { id: 'intimidacao', label: 'Intimidação', type: 'number', defaultValue: 0 },
        { id: 'intuicao', label: 'Intuição', type: 'number', defaultValue: 0 },
        { id: 'percepcao', label: 'Percepção', type: 'number', defaultValue: 0 },
        { id: 'religiao', label: 'Religião', type: 'number', defaultValue: 0 },
        { id: 'vontade', label: 'Vontade', type: 'number', defaultValue: 0 },
        { id: 'fortitude', label: 'Fortitude', type: 'number', defaultValue: 0 },
      ]
    },
    {
      id: 'narrative',
      title: 'Detalhes Narrativos',
      layout: 'list',
      fields: [
        { id: 'appearance', label: 'Aparência', type: 'longtext' },
        { id: 'personality', label: 'Personalidade', type: 'longtext' },
        { id: 'history', label: 'Histórico', type: 'longtext' },
        { id: 'objective', label: 'Objetivo', type: 'longtext' },
      ]
    },
    {
      id: 'rituals',
      title: 'Rituais',
      layout: 'list',
      fields: [
        {
          id: 'rituais',
          label: 'Rituais Escolhidos',
          type: 'multiselect',
          options: RITUAIS.map(r => ({ 
            label: `[${r.circle}º] ${r.name} (${r.element.join('/')})`, 
            value: r.id 
          }))
        }
      ]
    }
  ]
};
