import { Weapon } from '../models/weapon';

export const WEAPONS: Weapon[] = [
  new Weapon(1, 'Épée de la finesse', 0, -5, 5, 0),
  new Weapon(2, 'Lunette de feu', 5, -5, 0, 0),
  new Weapon(3, 'Bouclier lourd', -2, 0, 0, 2),
  new Weapon(4, 'Couteau rapide', 1, 1, 1, -3)
];
