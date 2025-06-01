import { HttpInterceptorFn } from '@angular/common/http';

export const intercepteurInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;

  if (typeof localStorage !== 'undefined') {
    token = localStorage.getItem('jwt');
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(cloned);
  }

  return next(req);
};
