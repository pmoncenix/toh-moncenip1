import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormGroup
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Hero, HERO_MAX_POINTS } from '../../models/hero';
import { Weapon } from '../../models/weapon';
import { HeroService } from '../../services/hero.service';
import { WeaponService } from '../../services/weapon.service';

@Component({
  selector: 'app-hero-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './hero-edit.html',
  styleUrl: './hero-edit.css'
})
export class HeroEdit implements OnInit, OnDestroy {
  heroForm!: FormGroup;

  weapons: Weapon[] = [];
  hero?: Hero;
  isNew = false;

  heroes: Hero[] = [];
  currentHeroId: number | null = null;

  private sub?: Subscription;

  readonly maxPoints = HERO_MAX_POINTS;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private heroService: HeroService,
    private weaponService: WeaponService
  ) {

    this.heroForm = this.fb.group(
      {
        id: [0],
        name: ['', Validators.required],
        attack: [10, [Validators.required, Validators.min(1)]],
        dodge: [10, [Validators.required, Validators.min(1)]],
        damage: [10, [Validators.required, Validators.min(1)]],
        hp: [10, [Validators.required, Validators.min(1)]],
        weaponId: [null as number | null]
      },
      {
        validators: [this.totalPointsValidator()]
      }
    );
  }

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
    });

    this.weaponService.getWeapons().subscribe(w => (this.weapons = w));

    this.sub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam || idParam === 'new') {
        this.isNew = true;
        this.currentHeroId = null;
        const newId = this.heroService.getNextId();
        this.heroForm.patchValue({ id: newId });
      } else {
        const id = Number(idParam);
        this.isNew = false;
        this.currentHeroId = id;

        this.heroService.getHero(id).subscribe(hero => {
          if (hero) {
            this.hero = hero;
            this.heroForm.patchValue({
              id: hero.id,
              name: hero.name,
              attack: hero.attack,
              dodge: hero.dodge,
              damage: hero.damage,
              hp: hero.hp,
              weaponId: hero.weaponId ?? null
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private toNumber(value: unknown): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  }

  totalPoints(): number {
    const v = this.heroForm.value;
    const a = this.toNumber(v.attack);
    const e = this.toNumber(v.dodge);
    const d = this.toNumber(v.damage);
    const p = this.toNumber(v.hp);
    return a + e + d + p;
  }

  remainingPoints(): number {
    return this.maxPoints - this.totalPoints();
  }

  totalPointsValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const a = this.toNumber(control.get('attack')?.value);
      const e = this.toNumber(control.get('dodge')?.value);
      const d = this.toNumber(control.get('damage')?.value);
      const p = this.toNumber(control.get('hp')?.value);
      const sum = a + e + d + p;
      return sum <= HERO_MAX_POINTS ? null : { totalPoints: { sum } };
    };
  }

  selectedWeapon(): Weapon | undefined {
    const id = this.heroForm.get('weaponId')?.value;
    if (id == null) return undefined;
    return this.weapons.find(w => w.id === id);
  }

  isWeaponTaken(weapon: Weapon): boolean {
    if (!weapon) return false;

    const users = this.heroes.filter(h => h.weaponId === weapon.id);

    if (this.currentHeroId === null) {
      return users.length > 0;
    }

    return users.some(h => h.id !== this.currentHeroId);
  }

canEquipWeapon(weapon: Weapon | undefined): boolean {
  if (!weapon) return true;
  const v = this.heroForm.value;
  const a = this.toNumber(v.attack) + weapon.attack;
  const e = this.toNumber(v.dodge) + weapon.dodge;
  const d = this.toNumber(v.damage) + weapon.damage;
  const p = this.toNumber(v.hp) + weapon.hp;
  return a >= 1 && e >= 1 && d >= 1 && p >= 1;
}


  weaponWouldBreakConstraint(): boolean {
    const weapon = this.selectedWeapon();
    if (!weapon) return false;
    return !this.canEquipWeapon(weapon);
  }

  save(): void {
    if (this.heroForm.invalid || this.weaponWouldBreakConstraint()) {
      this.heroForm.markAllAsTouched();
      return;
    }

    const v = this.heroForm.value;
    const hero = new Hero(
      v.id ?? this.heroService.getNextId(),
      v.name ?? '',
      v.attack ?? 1,
      v.dodge ?? 1,
      v.damage ?? 1,
      v.hp ?? 1,
      v.weaponId ?? null
    );

    if (this.isNew) {
      this.heroService.addHero(hero);
    } else {
      this.heroService.updateHero(hero);
    }

    this.router.navigate(['/heroes']);
  }

  cancel(): void {
    this.router.navigate(['/heroes']);
  }
}
