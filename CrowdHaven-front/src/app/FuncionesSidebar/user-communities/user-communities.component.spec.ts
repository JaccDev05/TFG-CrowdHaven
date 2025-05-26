import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCommunitiesComponent } from './user-communities.component';

describe('UserCommunitiesComponent', () => {
  let component: UserCommunitiesComponent;
  let fixture: ComponentFixture<UserCommunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCommunitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
