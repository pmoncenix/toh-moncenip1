import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WeaponService } from '../../services/weapon.service';
import { HeroService } from '../../services/hero.service';
import { Weapon } from '../../models/weapon';
import { Hero } from '../../models/hero';

type SortKey = 'name' | 'attack' | 'dodge' | 'damage' | 'hp';

@Component({
  selector: 'app-weapon-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './weapon-list.html',
  styleUrl: './weapon-list.css'
})
export class WeaponList implements OnInit {
  weapons: Weapon[] = [];
  heroes: Hero[] = [];

  filterName = '';
  sortKey: SortKey = 'name';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(
    private weaponService: WeaponService,
    private heroService: HeroService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.weaponService.getWeapons().subscribe(weapons => {
      this.weapons = weapons;
      this.cdr.detectChanges();
    });

    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.cdr.detectChanges();
    });
  }

  usersCount(weapon: Weapon): number {
    return this.heroes.filter(h => h.weaponId === weapon.id).length;
  }

  delete(weapon: Weapon): void {
    if (this.usersCount(weapon) > 0) {
      alert(
        "Impossible de supprimer : au moins un héro utilise encore cette arme."
      );
      return;
    }
    if (confirm(`Supprimer l'arme "${weapon.name}" ?`)) {
      this.weaponService.deleteWeapon(weapon.id);
    }
  }

  get filteredWeapons(): Weapon[] {
    let result = [...this.weapons];

    if (this.filterName.trim()) {
      const term = this.filterName.toLowerCase();
      result = result.filter(w => w.name.toLowerCase().includes(term));
    }

    result.sort((a, b) => {
      const dir = this.sortDir === 'asc' ? 1 : -1;
      switch (this.sortKey) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'attack':
          return (a.attack - b.attack) * dir;
        case 'dodge':
          return (a.dodge - b.dodge) * dir;
        case 'damage':
          return (a.damage - b.damage) * dir;
        case 'hp':
          return (a.hp - b.hp) * dir;
      }
    });

    return result;
  }

  heroesUsing(weapon: Weapon): Hero[] {
    return this.heroes.filter(h => h.weaponId === weapon.id);
  }

  heroNamesFor(weapon: Weapon): string {
    const list = this.heroesUsing(weapon);
    if (list.length === 0) {
      return 'Aucun';
    }
    return list.map(h => h.name).join(', ');
  }
}

