import { OrdemClassBase, OrdemRitual, OrdemSkillDefinition, OrdemTrilha } from './ordem-paranormal.models';

export const SKILLS: OrdemSkillDefinition[] = [
  // AGI
  { id: 'acrobacia', name: 'Acrobacia', baseAttribute: 'AGI', trainedOnly: false, loadPenalty: true },
  { id: 'crime', name: 'Crime', baseAttribute: 'AGI', trainedOnly: true, loadPenalty: true },
  { id: 'furtividade', name: 'Furtividade', baseAttribute: 'AGI', trainedOnly: false, loadPenalty: true },
  { id: 'iniciativa', name: 'Iniciativa', baseAttribute: 'AGI', trainedOnly: false, loadPenalty: false },
  { id: 'pilotagem', name: 'Pilotagem', baseAttribute: 'AGI', trainedOnly: true, loadPenalty: false },
  { id: 'pontaria', name: 'Pontaria', baseAttribute: 'AGI', trainedOnly: false, loadPenalty: false },
  { id: 'reflexos', name: 'Reflexos', baseAttribute: 'AGI', trainedOnly: false, loadPenalty: false },
  // FOR
  { id: 'atletismo', name: 'Atletismo', baseAttribute: 'FOR', trainedOnly: false, loadPenalty: false },
  { id: 'luta', name: 'Luta', baseAttribute: 'FOR', trainedOnly: false, loadPenalty: false },
  // INT
  { id: 'atualidades', name: 'Atualidades', baseAttribute: 'INT', trainedOnly: false, loadPenalty: false },
  { id: 'ciencias', name: 'Ciências', baseAttribute: 'INT', trainedOnly: true, loadPenalty: false },
  { id: 'investigacao', name: 'Investigação', baseAttribute: 'INT', trainedOnly: false, loadPenalty: false },
  { id: 'medicina', name: 'Medicina', baseAttribute: 'INT', trainedOnly: false, loadPenalty: false },
  { id: 'ocultismo', name: 'Ocultismo', baseAttribute: 'INT', trainedOnly: true, loadPenalty: false },
  { id: 'profissao', name: 'Profissão', baseAttribute: 'INT', trainedOnly: true, loadPenalty: false },
  { id: 'sobrevivencia', name: 'Sobrevivência', baseAttribute: 'INT', trainedOnly: false, loadPenalty: false },
  { id: 'tatica', name: 'Tática', baseAttribute: 'INT', trainedOnly: true, loadPenalty: false },
  { id: 'tecnologia', name: 'Tecnologia', baseAttribute: 'INT', trainedOnly: true, loadPenalty: false },
  // PRE
  { id: 'adestramento', name: 'Adestramento', baseAttribute: 'PRE', trainedOnly: true, loadPenalty: false },
  { id: 'artes', name: 'Artes', baseAttribute: 'PRE', trainedOnly: true, loadPenalty: false },
  { id: 'diplomacia', name: 'Diplomacia', baseAttribute: 'PRE', trainedOnly: false, loadPenalty: false },
  { id: 'enganacao', name: 'Enganação', baseAttribute: 'PRE', trainedOnly: false, loadPenalty: false },
  { id: 'intimidacao', name: 'Intimidação', baseAttribute: 'PRE', trainedOnly: false, loadPenalty: false },
  { id: 'intuicao', name: 'Intuição', baseAttribute: 'PRE', trainedOnly: false, loadPenalty: false },
  { id: 'percepcao', name: 'Percepção', baseAttribute: 'PRE', trainedOnly: false, loadPenalty: false },
  { id: 'religiao', name: 'Religião', baseAttribute: 'PRE', trainedOnly: true, loadPenalty: false },
  { id: 'vontade', name: 'Vontade', baseAttribute: 'PRE', trainedOnly: false, loadPenalty: false },
  // VIG
  { id: 'fortitude', name: 'Fortitude', baseAttribute: 'VIG', trainedOnly: false, loadPenalty: false },
];

export const CLASSES: OrdemClassBase[] = [
  {
    id: 'combatente',
    name: 'Combatente',
    initialPV: 20, gainPV: 4,
    initialSAN: 12, gainSAN: 3,
    initialPE: 2, gainPE: 2,
    initialAbilities: ['Ataque Especial']
  },
  {
    id: 'especialista',
    name: 'Especialista',
    initialPV: 16, gainPV: 3,
    initialSAN: 16, gainSAN: 4,
    initialPE: 3, gainPE: 3,
    initialAbilities: ['Perito', 'Eclético']
  },
  {
    id: 'ocultista',
    name: 'Ocultista',
    initialPV: 12, gainPV: 2,
    initialSAN: 20, gainSAN: 5,
    initialPE: 4, gainPE: 4,
    initialAbilities: ['Escolhido pelo Outro Lado']
  }
];

export const TRILHAS: OrdemTrilha[] = [
  // Combatente - Core
  { id: 'aniquilador', name: 'Aniquilador', classId: 'combatente', source: 'core', summary: '', unlocks: [] },
  { id: 'comandante_de_campo', name: 'Comandante de Campo', classId: 'combatente', source: 'core', summary: '', unlocks: [] },
  { id: 'guerreiro', name: 'Guerreiro', classId: 'combatente', source: 'core', summary: '', unlocks: [] },
  { id: 'operacoes_especiais', name: 'Operações Especiais', classId: 'combatente', source: 'core', summary: '', unlocks: [] },
  { id: 'tropa_de_choque', name: 'Tropa de Choque', classId: 'combatente', source: 'core', summary: '', unlocks: [] },
  // Combatente - Sobrevivendo ao Horror
  { id: 'agente_secreto', name: 'Agente Secreto', classId: 'combatente', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [] },
  { id: 'cacador', name: 'Caçador', classId: 'combatente', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [] },
  { id: 'monstruoso', name: 'Monstruoso', classId: 'combatente', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [{ nex: 25, ability: 'Habilidade 25%' }, { nex: 35, ability: 'Habilidade 35%' }, { nex: 40, ability: 'Habilidade 40%' }, { nex: 50, ability: 'Habilidade 50%' }, { nex: 65, ability: 'Habilidade 65%' }, { nex: 99, ability: 'Habilidade 99%' }] },
  // Combatente - Arquivos Secretos
  { id: 'performatico', name: 'Performático', classId: 'combatente', source: 'arquivos_secretos', summary: '', unlocks: [] },
  
  // Especialista - Core
  { id: 'atirador_de_elite', name: 'Atirador de Elite', classId: 'especialista', source: 'core', summary: '', unlocks: [] },
  { id: 'infiltrador', name: 'Infiltrador', classId: 'especialista', source: 'core', summary: '', unlocks: [] },
  { id: 'medico_de_campo', name: 'Médico de Campo', classId: 'especialista', source: 'core', summary: '', unlocks: [] },
  { id: 'negociador', name: 'Negociador', classId: 'especialista', source: 'core', summary: '', unlocks: [] },
  { id: 'tecnico', name: 'Técnico', classId: 'especialista', source: 'core', summary: '', unlocks: [] },
  // Especialista - Sobrevivendo ao Horror
  { id: 'bibliotecario', name: 'Bibliotecário', classId: 'especialista', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [] },
  { id: 'muambeiro', name: 'Muambeiro', classId: 'especialista', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [] },
  { id: 'perseverante', name: 'Perseverante', classId: 'especialista', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [] },

  // Ocultista - Core
  { id: 'conduite', name: 'Conduíte', classId: 'ocultista', source: 'core', summary: '', unlocks: [] },
  { id: 'flagelador', name: 'Flagelador', classId: 'ocultista', source: 'core', summary: '', unlocks: [] },
  { id: 'graduado', name: 'Graduado', classId: 'ocultista', source: 'core', summary: '', unlocks: [] },
  { id: 'intuitivo', name: 'Intuitivo', classId: 'ocultista', source: 'core', summary: '', unlocks: [] },
  { id: 'lamina_paranormal', name: 'Lâmina Paranormal', classId: 'ocultista', source: 'core', summary: '', unlocks: [{ nex: 10, ability: 'Habilidade 10%' }, { nex: 40, ability: 'Habilidade 40%' }, { nex: 99, ability: 'Habilidade 99%' }] },
  // Ocultista - Sobrevivendo ao Horror
  { id: 'exorcista', name: 'Exorcista', classId: 'ocultista', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [] },
  { id: 'parapsicologo', name: 'Parapsicólogo', classId: 'ocultista', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [] },
  { id: 'possuido', name: 'Possuído', classId: 'ocultista', source: 'sobrevivendo_ao_horror', summary: '', unlocks: [] },
  // Ocultista - Arquivos Secretos
  { id: 'maledictologo', name: 'Maledictólogo', classId: 'ocultista', source: 'arquivos_secretos', summary: '', unlocks: [] },
];

export const RITUAIS: OrdemRitual[] = [
  // Sangue - 1º Círculo
  {
    id: 'armadura_de_sangue',
    name: 'Armadura de Sangue',
    element: ['Sangue'],
    circle: 1,
    execution: 'Padrão',
    range: 'Pessoal',
    target: 'Você',
    duration: 'Cena',
    description: 'Você cria uma carapaça de sangue que aumenta sua Defesa em +5.'
  },
  {
    id: 'hemostasia',
    name: 'Hemostasia',
    element: ['Sangue'],
    circle: 1,
    execution: 'Padrão',
    range: 'Toque',
    target: '1 ser',
    duration: 'Instantânea',
    description: 'Você estanca sangramentos, curando 2d8+2 PV.'
  },
  // Morte - 1º Círculo
  {
    id: 'definhar',
    name: 'Definhar',
    element: ['Morte'],
    circle: 1,
    execution: 'Padrão',
    range: 'Curto',
    target: '1 ser',
    duration: 'Cena',
    resistance: 'Fortitude reduz',
    description: 'O alvo fica fatigado por toda a cena.'
  },
  {
    id: 'espirais_de_degeneraçao',
    name: 'Espirais de Degeneração',
    element: ['Morte'],
    circle: 1,
    execution: 'Padrão',
    range: 'Curto',
    target: '1 ser',
    duration: 'Cena',
    resistance: 'Fortitude reduz',
    description: 'O alvo sofre –2 em testes de perícia baseados em Força, Agilidade e Vigor.'
  },
  // Conhecimento - 1º Círculo
  {
    id: 'compreensao_paranormal',
    name: 'Compreensão Paranormal',
    element: ['Conhecimento'],
    circle: 1,
    execution: 'Padrão',
    range: 'Pessoal',
    target: 'Você',
    duration: 'Cena',
    description: 'Você entende qualquer idioma e recebe +5 em testes de Investigação.'
  },
  {
    id: 'terceiro_olho',
    name: 'Terceiro Olho',
    element: ['Conhecimento'],
    circle: 1,
    execution: 'Padrão',
    range: 'Pessoal',
    target: 'Você',
    duration: 'Cena',
    description: 'Você pode ver através de ilusões e enxergar seres invisíveis.'
  },
  // Energia - 1º Círculo
  {
    id: 'eletrocuçao',
    name: 'Eletrocução',
    element: ['Energia'],
    circle: 1,
    execution: 'Padrão',
    range: 'Curto',
    target: '1 ser',
    duration: 'Instantânea',
    resistance: 'Reflexos reduz',
    description: 'Você dispara um arco elétrico que causa 3d6 de dano de energia.'
  },
  {
    id: 'embaralhar',
    name: 'Embaralhar',
    element: ['Energia'],
    circle: 1,
    execution: 'Padrão',
    range: 'Pessoal',
    target: 'Você',
    duration: 'Cena',
    description: 'Cria duplicatas ilusórias, fornecendo +10 de Defesa contra ataques.'
  },
  // Sangue - 2º Círculo
  {
    id: 'odio_incontrolavel',
    name: 'Ódio Incontrolável',
    element: ['Sangue'],
    circle: 2,
    execution: 'Padrão',
    range: 'Curto',
    target: '1 ser',
    duration: 'Cena',
    description: 'O alvo entra em um frenesi de combate, recebendo +2 em testes de ataque e dano corpo a corpo, mas não pode realizar ações defensivas.'
  },
  // Morte - 2º Círculo
  {
    id: 'eco_espectro',
    name: 'Eco Espectro',
    element: ['Morte'],
    circle: 2,
    execution: 'Padrão',
    range: 'Curto',
    target: '1 ser',
    duration: 'Cena',
    resistance: 'Fortitude nega',
    description: 'Você cria um eco do alvo que o persegue, causando 2d6 de dano de morte no início de cada turno dele.'
  },
  // Conhecimento - 2º Círculo
  {
    id: 'leitura_de_mente',
    name: 'Leitura de Mente',
    element: ['Conhecimento'],
    circle: 2,
    execution: 'Padrão',
    range: 'Curto',
    target: '1 ser',
    duration: 'Concentração',
    resistance: 'Vontade nega',
    description: 'Você pode ler os pensamentos superficiais do alvo.'
  },
  // Energia - 2º Círculo
  {
    id: 'chamas_do_caos',
    name: 'Chamas do Caos',
    element: ['Energia'],
    circle: 2,
    execution: 'Padrão',
    range: 'Médio',
    target: 'Área (esfera de 6m)',
    duration: 'Instantânea',
    resistance: 'Reflexos reduz',
    description: 'Uma explosão de chamas mutáveis causa 6d6 de dano de fogo e energia.'
  },
  // Medo
  {
    id: 'medo_tangivel',
    name: 'Medo Tangível',
    element: ['Medo'],
    circle: 1,
    execution: 'Padrão',
    range: 'Curto',
    target: 'Área',
    duration: 'Cena',
    description: 'Cria uma barreira física feita de puro medo.'
  }
];
