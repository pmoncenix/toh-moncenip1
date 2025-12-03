import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { WeaponService } from '../../services/weapon.service';
import { Hero } from '../../models/hero';
import { Weapon } from '../../models/weapon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  topHeroes: Hero[] = [];
  topWeapons: Weapon[] = [];

  constructor(
    private heroService: HeroService,
    private weaponService: WeaponService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      const sorted = [...heroes].sort(
        (a, b) => b.attack + b.damage - (a.attack + a.damage)
      );
      this.topHeroes = sorted.slice(0, 4);
      this.cdr.detectChanges();
    });

    this.weaponService.getWeapons().subscribe(weapons => {
      const sorted = [...weapons].sort((a, b) => b.damage - a.damage);
      this.topWeapons = sorted.slice(0, 4);
      this.cdr.detectChanges();
    });
  }
}