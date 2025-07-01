import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifieCategorieComponent } from './modifie-categorie.component';

describe('ModifieCategorieComponent', () => {
  let component: ModifieCategorieComponent;
  let fixture: ComponentFixture<ModifieCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifieCategorieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifieCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
