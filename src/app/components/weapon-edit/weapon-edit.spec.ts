import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponEdit } from './weapon-edit';

describe('WeaponEdit', () => {
  let component: WeaponEdit;
  let fixture: ComponentFixture<WeaponEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
