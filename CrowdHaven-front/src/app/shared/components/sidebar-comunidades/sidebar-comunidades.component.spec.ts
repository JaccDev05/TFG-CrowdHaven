import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComunidadesComponent } from './sidebar-comunidades.component';

describe('SidebarComunidadesComponent', () => {
  let component: SidebarComunidadesComponent;
  let fixture: ComponentFixture<SidebarComunidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComunidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
