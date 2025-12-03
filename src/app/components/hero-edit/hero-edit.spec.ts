import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroEdit } from './hero-edit';

describe('HeroEdit', () => {
  let component: HeroEdit;
  let fixture: ComponentFixture<HeroEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
