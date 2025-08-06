import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecipeslistComponent } from './my-recipeslist.component';

describe('MyRecipeslistComponent', () => {
  let component: MyRecipeslistComponent;
  let fixture: ComponentFixture<MyRecipeslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyRecipeslistComponent]
    });
    fixture = TestBed.createComponent(MyRecipeslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
