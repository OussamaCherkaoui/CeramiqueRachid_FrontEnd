import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitsAdminComponent } from './produits-admin.component';

describe('ProduitsAdminComponent', () => {
  let component: ProduitsAdminComponent;
  let fixture: ComponentFixture<ProduitsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitsAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProduitsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
