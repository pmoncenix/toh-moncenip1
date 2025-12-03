import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Weapon } from '../models/weapon';
import { WeaponDto } from '../models/weapon.dto';
import { MessageService } from './message.service';
import { db } from '../firebase/firebase';

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class WeaponService {
  private readonly collectionName = 'weapons';

  private weaponsSubject = new BehaviorSubject<Weapon[]>([]);
  weapons$ = this.weaponsSubject.asObservable();

  constructor(private messageService: MessageService) {
    this.loadWeaponsFromFirestore();
  }

  private log(message: string) {
    this.messageService.add(`WeaponService: ${message}`);
  }

  private fromDto(dto: WeaponDto): Weapon {
    return new Weapon(
      dto.id,
      dto.name,
      dto.attack,
      dto.dodge,
      dto.damage,
      dto.hp
    );
  }

  private toDto(weapon: Weapon): WeaponDto {
    return {
      id: weapon.id,
      name: weapon.name,
      attack: weapon.attack,
      dodge: weapon.dodge,
      damage: weapon.damage,
      hp: weapon.hp
    };
  }

  private async loadWeaponsFromFirestore(): Promise<void> {
    try {
      const colRef = collection(db, this.collectionName);
      const snapshot = await getDocs(colRef);

      const weapons: Weapon[] = snapshot.docs.map(docSnap =>
        this.fromDto(docSnap.data() as WeaponDto)
      );

      this.weaponsSubject.next(weapons);
      this.log('armes chargées depuis Firestore');
    } catch (err) {
      this.log('Erreur lors du chargement des armes : ' + err);
    }
  }

  getWeapons(): Observable<Weapon[]> {
    return this.weapons$;
  }

  getWeapon(id: number): Observable<Weapon | undefined> {
    return this.weapons$.pipe(
      map(weapons => weapons.find(w => w.id === id))
    );
  }

  getNextId(): number {
    const ids = this.weaponsSubject.value.map(w => w.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  addWeapon(weapon: Weapon): void {
    const weapons = [...this.weaponsSubject.value, weapon];
    this.weaponsSubject.next(weapons);
    this.log(`arme ajoutée (local) id=${weapon.id}`);

    const dto = this.toDto(weapon);
    const docRef = doc(db, this.collectionName, String(weapon.id));

    setDoc(docRef, dto)
      .then(() => this.log(`arme ajoutée dans Firestore id=${weapon.id}`))
      .catch(err =>
        this.log("Erreur lors de l'ajout de l'arme dans Firestore : " + err)
      );
  }

  updateWeapon(weapon: Weapon): void {
    const weapons = [...this.weaponsSubject.value];
    const index = weapons.findIndex(w => w.id === weapon.id);
    if (index === -1) {
      this.log(`updateWeapon: arme id=${weapon.id} introuvable en local`);
      return;
    }

    weapons[index] = weapon;
    this.weaponsSubject.next(weapons);
    this.log(`arme mise à jour (local) id=${weapon.id}`);

    const dto = this.toDto(weapon);
    const docRef = doc(db, this.collectionName, String(weapon.id));

    setDoc(docRef, dto, { merge: true })
      .then(() => this.log(`arme mise à jour dans Firestore id=${weapon.id}`))
      .catch(err =>
        this.log(
          "Erreur lors de la mise à jour de l'arme dans Firestore : " + err
        )
      );
  }

  deleteWeapon(id: number): void {
    const weapons = this.weaponsSubject.value.filter(w => w.id !== id);
    this.weaponsSubject.next(weapons);
    this.log(`arme supprimée (local) id=${id}`);

    const docRef = doc(db, this.collectionName, String(id));

    deleteDoc(docRef)
      .then(() => this.log(`arme supprimée dans Firestore id=${id}`))
      .catch(err =>
        this.log(
          "Erreur lors de la suppression de l'arme dans Firestore : " + err
        )
      );
  }
}
