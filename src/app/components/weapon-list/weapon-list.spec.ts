import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponList } from './weapon-list';

describe('WeaponList', () => {
  let component: WeaponList;
  let fixture: ComponentFixture<WeaponList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
