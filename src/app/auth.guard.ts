import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService);
  const router = inject(Router);

  if (authservice.hasToken()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
