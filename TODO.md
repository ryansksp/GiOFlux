# TODO - Login Redirect Loop Fix

## Issue Description
When logging in, the system prompts for login again and flashes before entering. This is caused by a race condition where the user is authenticated but the profile data is still loading, causing premature redirects.

## Changes Made
- [x] Modified `src/App.jsx` PrivateRoute component to separate authentication check from profile loading check
- [x] Added loading spinner while profile is being fetched after authentication
- [x] Prevented redirect to login when user is authenticated but profile is still loading

## Testing
- [ ] Test login flow to ensure no more redirect loop
- [ ] Verify that approved users can access the dashboard
- [ ] Verify that pending users see the approval page
- [ ] Verify that unauthenticated users are redirected to login

## Follow-up Steps
- [ ] Monitor for any authentication issues after deployment
- [ ] Consider adding retry logic for profile fetching if needed
