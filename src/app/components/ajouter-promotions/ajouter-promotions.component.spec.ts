import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPromotionsComponent } from './ajouter-promotions.component';

describe('AjouterPromotionsComponent', () => {
  let component: AjouterPromotionsComponent;
  let fixture: ComponentFixture<AjouterPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterPromotionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
