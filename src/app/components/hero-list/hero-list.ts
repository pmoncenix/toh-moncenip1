import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { WeaponService } from '../../services/weapon.service';
import { Hero } from '../../models/hero';
import { Weapon } from '../../models/weapon';
import { FormsModule } from '@angular/forms';

type SortKey = 'name' | 'attack' | 'dodge' | 'damage' | 'hp';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.css'
})
export class HeroList implements OnInit {
  heroes: Hero[] = [];
  weapons: Weapon[] = [];

  filterName = '';
  sortKey: SortKey = 'name';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(
    private heroService: HeroService,
    private weaponService: WeaponService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.cdr.detectChanges(); // ✅ force le refresh en zoneless
    });

    this.weaponService.getWeapons().subscribe(weapons => {
      this.weapons = weapons;
      this.cdr.detectChanges(); // ✅ idem
    });
  }

  getWeapon(hero: Hero): Weapon | undefined {
    return this.weapons.find(w => w.id === hero.weaponId);
  }

  delete(hero: Hero): void {
    if (confirm(`Supprimer le héro "${hero.name}" ?`)) {
      this.heroService.deleteHero(hero.id);
    }
  }

  get filteredHeroes(): Hero[] {
    let result = [...this.heroes];

    if (this.filterName.trim()) {
      const term = this.filterName.toLowerCase();
      result = result.filter(h => h.name.toLowerCase().includes(term));
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
}
