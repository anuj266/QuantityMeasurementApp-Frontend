import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth-callback',
  template: `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;">
      <div style="text-align:center;">
        <div style="font-size:32px;margin-bottom:16px;">⏳</div>
        <p style="color:#666;">Completing Google login...</p>
      </div>
    </div>
  `
})
export class OAuthCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];

      if (accessToken && refreshToken) {
        // Store tokens exactly like regular login
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Redirect to home after successful Google login
        this.router.navigate(['/home']);
      } else {
        // Something went wrong, go back to auth
        this.router.navigate(['/auth']);
      }
    });
  }
}
