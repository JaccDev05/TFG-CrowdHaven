import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFunctionsLayoutComponent } from './user-functions-layout.component';

describe('UserFunctionsLayoutComponent', () => {
  let component: UserFunctionsLayoutComponent;
  let fixture: ComponentFixture<UserFunctionsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFunctionsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFunctionsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
