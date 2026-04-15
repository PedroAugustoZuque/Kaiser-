import { vitest, describe, it, expect, beforeEach } from 'vitest';
import { OrdemParanormalService } from './ordem-paranormal.service';

describe('OrdemParanormalService', () => {
  let service: OrdemParanormalService;

  beforeEach(() => {
    service = new OrdemParanormalService();
  });

  it('should calculate resources correctly for a Combatente NEX 5%', () => {
    const char = {
      classId: 'combatente',
      nex: 5,
      attributes: { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 2 }
    };

    const resources = service.calculateResources(char as any);

    // Initial PV: 20 + Vigor(2) = 22
    expect(resources.pv_max).toBe(22);
    // Initial SAN: 12
    expect(resources.san_max).toBe(12);
    // Initial PE: 2 + Presence(1) = 3
    expect(resources.pe_max).toBe(3);
    // PE/Round: NEX 5% = 1
    expect(resources.pe_per_round).toBe(1);
    // Defense: 10 + AGI(1) = 11
    expect(resources.defesa).toBe(11);
  });

  it('should calculate resources correctly for a Combatente NEX 10% (Level 2)', () => {
    const char = {
      classId: 'combatente',
      nex: 10,
      attributes: { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 2 }
    };

    const resources = service.calculateResources(char as any);

    // Initial PV: 20 + Vigor(2) = 22
    // Gain at 10%: GainPV(4) + Vigor(2) = 6
    // Total: 22 + 6 = 28
    expect(resources.pv_max).toBe(28);
    
    // Initial SAN: 12
    // Gain at 10%: GainSAN(3)
    // Total: 12 + 3 = 15
    expect(resources.san_max).toBe(15);
    
    // Initial PE: 2 + Presence(1) = 3
    // Gain at 10%: GainPE(2) + Presence(1) = 3
    // Total: 3 + 3 = 6
    expect(resources.pe_max).toBe(6);
    
    // PE/Round: NEX 10% = 2
    expect(resources.pe_per_round).toBe(2);
  });

  it('should calculate resources correctly for an Ocultista NEX 50%', () => {
    const char = {
      classId: 'ocultista',
      nex: 50,
      attributes: { AGI: 1, FOR: 1, INT: 1, PRE: 4, VIG: 1 }
    };

    const resources = service.calculateResources(char as any);
    const level = 10; // 50 / 5
    const levelGains = 9;

    // Initial PV: 12 + Vigor(1) = 13
    // Gains: 9 * (GainPV(2) + Vigor(1)) = 9 * 3 = 27
    // Total: 13 + 27 = 40
    expect(resources.pv_max).toBe(40);

    // Initial PE: 4 + Presence(4) = 8
    // Gains: 9 * (GainPE(4) + Presence(4)) = 9 * 8 = 72
    // Total: 8 + 72 = 80
    expect(resources.pe_max).toBe(80);

    expect(resources.pe_per_round).toBe(10);
  });
});
