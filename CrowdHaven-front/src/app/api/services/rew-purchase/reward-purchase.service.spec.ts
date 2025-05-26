import { TestBed } from '@angular/core/testing';

import { RewardPurchaseService } from './reward-purchase.service';

describe('RewardPurchaseService', () => {
  let service: RewardPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RewardPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
