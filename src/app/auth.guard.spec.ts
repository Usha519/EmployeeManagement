import { TestBed } from '@angular/core/testing';
import { CanActivate, Router } from '@angular/router';

// Import the correct class name 'AuthGuard' from './auth.guard'
import { AuthGuard } from './auth.guard';

describe('authGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, Router], // Provide AuthGuard and Router in the testing module
    });

    authGuard = TestBed.inject(AuthGuard); // Get an instance of AuthGuard
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy(); // Assert that the AuthGuard instance exists
  });
});