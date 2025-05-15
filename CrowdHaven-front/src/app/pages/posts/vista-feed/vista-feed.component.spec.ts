import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaFeedComponent } from './vista-feed.component';

describe('VistaFeedComponent', () => {
  let component: VistaFeedComponent;
  let fixture: ComponentFixture<VistaFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
