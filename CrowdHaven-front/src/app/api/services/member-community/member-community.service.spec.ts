import { TestBed } from '@angular/core/testing';

import { MemberCommunityService } from './member-community.service';

describe('MemberCommunityService', () => {
  let service: MemberCommunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberCommunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
