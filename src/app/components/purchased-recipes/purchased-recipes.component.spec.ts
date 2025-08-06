import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedRecipesComponent } from './purchased-recipes.component';

describe('PurchasedRecipesComponent', () => {
  let component: PurchasedRecipesComponent;
  let fixture: ComponentFixture<PurchasedRecipesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchasedRecipesComponent]
    });
    fixture = TestBed.createComponent(PurchasedRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
