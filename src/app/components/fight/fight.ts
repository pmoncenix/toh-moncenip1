import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Hero } from '../../models/hero';
import { Weapon } from '../../models/weapon';
import { HeroService } from '../../services/hero.service';
import { WeaponService } from '../../services/weapon.service';

interface FighterState {
  hero: Hero;
  weapon?: Weapon;
  currentHp: number;
}

@Component({
  selector: 'app-fight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fight.html',
  styleUrl: './fight.css',
})
export class Fight implements OnInit {
  heroes: Hero[] = [];
  weapons: Weapon[] = [];

  selectedAttackerId: number | null = null;
  selectedDefenderId: number | null = null;

  logs: string[] = [];
  winnerName: string | null = null;
  isSimulating = false;

  constructor(
    private heroService: HeroService,
    private weaponService: WeaponService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
      this.cdr.detectChanges();
    });

    this.weaponService.getWeapons().subscribe((weapons) => {
      this.weapons = weapons;
      this.cdr.detectChanges();
    });
  }

  get attacker(): Hero | undefined {
    if (this.selectedAttackerId == null) return undefined;
    return this.heroes.find((h) => h.id === this.selectedAttackerId);
  }

  get defender(): Hero | undefined {
    if (this.selectedDefenderId == null) return undefined;
    return this.heroes.find((h) => h.id === this.selectedDefenderId);
  }

  getWeaponFor(hero: Hero | undefined): Weapon | undefined {
    if (!hero || hero.weaponId == null) return undefined;
    return this.weapons.find((w) => w.id === hero.weaponId);
  }

  private computeTotals(hero: Hero, weapon?: Weapon) {
    const attack = hero.attack + (weapon?.attack ?? 0);
    const dodge = hero.dodge + (weapon?.dodge ?? 0);
    const damage = hero.damage + (weapon?.damage ?? 0);
    const hp = hero.hp + (weapon?.hp ?? 0);
    return { attack, dodge, damage, hp };
  }

  canLaunchFight(): boolean {
    return (
      !!this.attacker &&
      !!this.defender &&
      this.attacker.id !== this.defender.id &&
      !this.isSimulating
    );
  }

  simulateFight(): void {
    if (!this.canLaunchFight()) {
      return;
    }

    const attackerHero = this.attacker!;
    const defenderHero = this.defender!;
    const attackerWeapon = this.getWeaponFor(attackerHero);
    const defenderWeapon = this.getWeaponFor(defenderHero);

    const attStats = this.computeTotals(attackerHero, attackerWeapon);
    const defStats = this.computeTotals(defenderHero, defenderWeapon);

    const attackerState: FighterState = {
      hero: attackerHero,
      weapon: attackerWeapon,
      currentHp: attStats.hp,
    };
    const defenderState: FighterState = {
      hero: defenderHero,
      weapon: defenderWeapon,
      currentHp: defStats.hp,
    };

    this.logs = [];
    this.winnerName = null;
    this.isSimulating = true;

    const logs: string[] = [];

    logs.push(
      `Début du combat : ${attackerHero.name} vs ${defenderHero.name}`
    );
    logs.push(
      `${attackerHero.name} – Att ${attStats.attack}, Esq ${attStats.dodge}, Dég ${attStats.damage}, PV ${attStats.hp}`
    );
    logs.push(
      `${defenderHero.name} – Att ${defStats.attack}, Esq ${defStats.dodge}, Dég ${defStats.damage}, PV ${defStats.hp}`
    );

    let isAttackerTurn = true;
    let round = 1;
    const maxRounds = 50;

    while (
      attackerState.currentHp > 0 &&
      defenderState.currentHp > 0 &&
      round <= maxRounds
    ) {
      const active = isAttackerTurn ? attackerState : defenderState;
      const target = isAttackerTurn ? defenderState : attackerState;
      const activeStats = isAttackerTurn ? attStats : defStats;
      const targetStats = isAttackerTurn ? defStats : attStats;

      let hitChance = 0.5 + (activeStats.attack - targetStats.dodge) * 0.03;
      if (hitChance < 0.15) hitChance = 0.15;
      if (hitChance > 0.9) hitChance = 0.9;

      const roll = Math.random();
      const damage = Math.max(1, activeStats.damage);

      if (roll <= hitChance) {
        target.currentHp -= damage;
        logs.push(
          `Tour ${round} – ${active.hero.name} touche ${target.hero.name} (${damage} dégâts, PV restants : ${Math.max(
            0,
            target.currentHp
          )})`
        );
      } else {
        logs.push(
          `Tour ${round} – ${active.hero.name} rate son attaque sur ${target.hero.name}`
        );
      }

      if (target.currentHp <= 0) {
        logs.push(`${target.hero.name} tombe au combat.`);
        break;
      }

      isAttackerTurn = !isAttackerTurn;
      round++;
    }

    if (attackerState.currentHp <= 0 && defenderState.currentHp <= 0) {
      logs.push('Égalité parfaite : les deux héros sont à terre.');
      this.winnerName = null;
    } else if (attackerState.currentHp > 0 && defenderState.currentHp <= 0) {
      logs.push(`Victoire de ${attackerState.hero.name}.`);
      this.winnerName = attackerState.hero.name;
    } else if (defenderState.currentHp > 0 && attackerState.currentHp <= 0) {
      logs.push(`Victoire de ${defenderState.hero.name}.`);
      this.winnerName = defenderState.hero.name;
    } else {
      logs.push('Combat interrompu (limite de tours atteinte).');
      this.winnerName =
        attackerState.currentHp >= defenderState.currentHp
          ? attackerState.hero.name
          : defenderState.hero.name;
    }

    this.logs = logs;
    this.isSimulating = false;
    this.cdr.detectChanges();
  }

  resetFight(): void {
    this.logs = [];
    this.winnerName = null;
  }
}
