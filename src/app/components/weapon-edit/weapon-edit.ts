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
import {
  Weapon,
  WEAPON_MAX_VALUE,
  WEAPON_MIN_VALUE
} from '../../models/weapon';
import { Hero } from '../../models/hero';
import { HeroService } from '../../services/hero.service';
import { WeaponService } from '../../services/weapon.service';

@Component({
  selector: 'app-weapon-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './weapon-edit.html',
  styleUrl: './weapon-edit.css'
})
export class WeaponEdit implements OnInit, OnDestroy {
  weaponForm!: FormGroup;

  heroesUsing: Hero[] = [];
  isNew = false;

  private sub?: Subscription;

  readonly minValue = WEAPON_MIN_VALUE;
  readonly maxValue = WEAPON_MAX_VALUE;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private heroService: HeroService,
    private weaponService: WeaponService
  ) {
    this.weaponForm = this.fb.group(
      {
        id: [0],
        name: ['', Validators.required],
        attack: [0, [Validators.required]],
        dodge: [0, [Validators.required]],
        damage: [0, [Validators.required]],
        hp: [0, [Validators.required]]
      },
      {
        validators: [this.weaponValidator()]
      }
    );
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam || idParam === 'new') {
        this.isNew = true;
        const newId = this.weaponService.getNextId();
        this.weaponForm.patchValue({ id: newId });
        this.heroesUsing = [];
      } else {
        const id = Number(idParam);
        this.isNew = false;
        this.weaponService.getWeapon(id).subscribe(weapon => {
          if (weapon) {
            this.weaponForm.patchValue({
              id: weapon.id,
              name: weapon.name,
              attack: weapon.attack,
              dodge: weapon.dodge,
              damage: weapon.damage,
              hp: weapon.hp
            });
          }
        });
        this.heroService
          .getHeroesByWeapon(id)
          .subscribe(heroes => (this.heroesUsing = heroes));
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  totalPoints(): number {
    const v = this.weaponForm.value;
    const a = v.attack ?? 0;
    const e = v.dodge ?? 0;
    const d = v.damage ?? 0;
    const p = v.hp ?? 0;
    return a + e + d + p;
  }

  remainingPoints(): number {
    return 0 - this.totalPoints();
  }

  weaponValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const a = control.get('attack')?.value ?? 0;
      const e = control.get('dodge')?.value ?? 0;
      const d = control.get('damage')?.value ?? 0;
      const p = control.get('hp')?.value ?? 0;
      const stats = [a, e, d, p];
      const sum = a + e + d + p;

      const inRange = stats.every(
        v => v >= WEAPON_MIN_VALUE && v <= WEAPON_MAX_VALUE
      );

      const errors: any = {};
      if (!inRange) errors.range = true;
      if (sum !== 0) errors.totalPoints = { sum };

      return Object.keys(errors).length ? errors : null;
    };
  }

  save(): void {
    if (this.weaponForm.invalid) {
      this.weaponForm.markAllAsTouched();
      return;
    }

    const v = this.weaponForm.value;
    const weapon = new Weapon(
      v.id ?? this.weaponService.getNextId(),
      v.name ?? '',
      v.attack ?? 0,
      v.dodge ?? 0,
      v.damage ?? 0,
      v.hp ?? 0
    );

    if (this.isNew) {
      this.weaponService.addWeapon(weapon);
    } else {
      this.weaponService.updateWeapon(weapon);
    }

    this.router.navigate(['/weapons']);
  }

  cancel(): void {
    this.router.navigate(['/weapons']);
  }
}
