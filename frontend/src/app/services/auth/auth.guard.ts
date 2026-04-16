import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { IdentityService } from '../identity/identity.service';

export const authGuard: CanActivateFn = () => {
  const identityService = inject(IdentityService);
  const router = inject(Router);

  if (identityService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
