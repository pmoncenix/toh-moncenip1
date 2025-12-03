import { Weapon } from './weapon';

export const HERO_MAX_POINTS = 40;

export class Hero {
  constructor(
    public id: number,
    public name: string,
    public attack: number,
    public dodge: number,
    public damage: number,
    public hp: number,
    public weaponId: number | null = null
  ) {}

  get totalBasePoints(): number {
    return this.attack + this.dodge + this.damage + this.hp;
  }

  isBaseValid(): boolean {
    return (
      this.attack >= 1 &&
      this.dodge >= 1 &&
      this.damage >= 1 &&
      this.hp >= 1 &&
      this.totalBasePoints <= HERO_MAX_POINTS
    );
  }

  withWeapon(weapon?: Weapon | null) {
    const att = this.totalAttack(weapon);
    const dod = this.totalDodge(weapon);
    const dmg = this.totalDamage(weapon);
    const hp = this.totalHp(weapon);
    return { attack: att, dodge: dod, damage: dmg, hp };
  }

  totalAttack(weapon?: Weapon | null): number {
    return this.attack + (weapon?.attack ?? 0);
  }

  totalDodge(weapon?: Weapon | null): number {
    return this.dodge + (weapon?.dodge ?? 0);
  }

  totalDamage(weapon?: Weapon | null): number {
    return this.damage + (weapon?.damage ?? 0);
  }

  totalHp(weapon?: Weapon | null): number {
    return this.hp + (weapon?.hp ?? 0);
  }

  canEquip(weapon?: Weapon | null): boolean {
    if (!weapon) return true;
    const totals = this.withWeapon(weapon);
    return (
      totals.attack >= 1 &&
      totals.dodge >= 1 &&
      totals.damage >= 1 &&
      totals.hp >= 1
    );
  }
}
