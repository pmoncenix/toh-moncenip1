import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Hero } from '../models/hero';
import { HeroDto } from '../models/heroe.dto';
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
export class HeroService {
  private readonly collectionName = 'heroes';

  private heroesSubject = new BehaviorSubject<Hero[]>([]);
  heroes$ = this.heroesSubject.asObservable();

  constructor(private messageService: MessageService) {
    this.loadHeroesFromFirestore();
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private fromDto(dto: HeroDto): Hero {
    return new Hero(
      dto.id,
      dto.name,
      dto.attack,
      dto.dodge,
      dto.damage,
      dto.hp,
      dto.weaponId
    );
  }

  private toDto(hero: Hero): HeroDto {
    return {
      id: hero.id,
      name: hero.name,
      attack: hero.attack,
      dodge: hero.dodge,
      damage: hero.damage,
      hp: hero.hp,
      weaponId: hero.weaponId ?? null
    };
  }

  private async loadHeroesFromFirestore(): Promise<void> {
    try {
      const colRef = collection(db, this.collectionName);
      const snapshot = await getDocs(colRef);

      const heroes: Hero[] = snapshot.docs.map(docSnap =>
        this.fromDto(docSnap.data() as HeroDto)
      );

      this.heroesSubject.next(heroes);
      this.log('héros chargés depuis Firestore');
    } catch (err) {
      this.log('Erreur lors du chargement des héros : ' + err);
    }
  }

  getHeroes(): Observable<Hero[]> {
    return this.heroes$;
  }

  getHero(id: number): Observable<Hero | undefined> {
    return this.heroes$.pipe(
      map(heroes => heroes.find(h => h.id === id))
    );
  }

  getHeroesByWeapon(weaponId: number): Observable<Hero[]> {
    return this.heroes$.pipe(
      map(heroes => heroes.filter(h => h.weaponId === weaponId))
    );
  }

  getNextId(): number {
    const ids = this.heroesSubject.value.map(h => h.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  addHero(hero: Hero): void {
    const heroes = [...this.heroesSubject.value, hero];
    this.heroesSubject.next(heroes);
    this.log(`héros ajouté (local) id=${hero.id}`);

    const dto = this.toDto(hero);
    const docRef = doc(db, this.collectionName, String(hero.id));

    setDoc(docRef, dto)
      .then(() => this.log(`héros ajouté dans Firestore id=${hero.id}`))
      .catch(err =>
        this.log("Erreur lors de l'ajout du héros dans Firestore : " + err)
      );
  }

  updateHero(hero: Hero): void {
    const heroes = [...this.heroesSubject.value];
    const index = heroes.findIndex(h => h.id === hero.id);
    if (index === -1) {
      this.log(`updateHero: héro id=${hero.id} introuvable en local`);
      return;
    }

    heroes[index] = hero;
    this.heroesSubject.next(heroes);
    this.log(`héros mis à jour (local) id=${hero.id}`);

    const dto = this.toDto(hero);
    const docRef = doc(db, this.collectionName, String(hero.id));

    setDoc(docRef, dto, { merge: true })
      .then(() => this.log(`héros mis à jour dans Firestore id=${hero.id}`))
      .catch(err =>
        this.log(
          "Erreur lors de la mise à jour du héros dans Firestore : " + err
        )
      );
  }

  deleteHero(id: number): void {
    const heroes = this.heroesSubject.value.filter(h => h.id !== id);
    this.heroesSubject.next(heroes);
    this.log(`héros supprimé (local) id=${id}`);

    const docRef = doc(db, this.collectionName, String(id));

    deleteDoc(docRef)
      .then(() => this.log(`héros supprimé dans Firestore id=${id}`))
      .catch(err =>
        this.log(
          "Erreur lors de la suppression du héros dans Firestore : " + err
        )
      );
  }
}
