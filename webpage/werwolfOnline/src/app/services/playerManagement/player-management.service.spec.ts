import { TestBed } from '@angular/core/testing';

import { PlayerManagementService } from './player-management.service';

describe('PlayerManagementService', () => {
  let service: PlayerManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
