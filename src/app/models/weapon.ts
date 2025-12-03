export const WEAPON_MIN_VALUE = -5;
export const WEAPON_MAX_VALUE = 5;

export class Weapon {
  constructor(
    public id: number,
    public name: string,
    public attack: number,
    public dodge: number,
    public damage: number,
    public hp: number
  ) {}

  get totalPoints(): number {
    return this.attack + this.dodge + this.damage + this.hp;
  }

  isValid(): boolean {
    const stats = [this.attack, this.dodge, this.damage, this.hp];
    const inRange = stats.every(
      v => v >= WEAPON_MIN_VALUE && v <= WEAPON_MAX_VALUE
    );
    return inRange && this.totalPoints === 0;
  }
}
