---
title: .env
---

WorkflowStudio provides a flexible authorization system similar to Laravel Horizon, allowing you to control who can access your workflow management interface.

## Default Behavior

By default, WorkflowStudio is **only accessible in the `local` environment**. In production, you must explicitly configure authorization.

## Configuring Authorization

Authorization is configured using the `WorkflowStudio::auth()` method in your `App\Providers\AppServiceProvider`:

```php
<?php

namespace App\Providers;

use WorkflowStudio\WorkflowStudio;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        WorkflowStudio::auth(function ($request) {
            // Your authorization logic here
            return $request->user()?->isAdmin();
        });
    }
}
```

## Authorization Examples

### Example 1: Admin Users Only

```php
WorkflowStudio::auth(function ($request) {
    return app()->environment('local') ||
           $request->user()?->isAdmin();
});
```

### Example 2: Specific Email Addresses

```php
WorkflowStudio::auth(function ($request) {
    return in_array($request->user()?->email, [
        'admin@example.com',
        'developer@example.com',
        'manager@example.com',
    ]);
});
```

### Example 3: Role-Based Access

```php
// Using Spatie Laravel Permission or similar
WorkflowStudio::auth(function ($request) {
    return $request->user()?->hasRole(['admin', 'workflow-manager']);
});
```

### Example 4: Permission-Based Access

```php
WorkflowStudio::auth(function ($request) {
    return $request->user()?->can('manage-workflows');
});
```

### Example 5: Multiple Conditions

```php
WorkflowStudio::auth(function ($request) {
    $user = $request->user();
    
    // Allow in local environment
    if (app()->environment('local')) {
        return true;
    }
    
    // Require authentication
    if (!$user) {
        return false;
    }
    
    // Allow admins
    if ($user->isAdmin()) {
        return true;
    }
    
    // Allow specific roles with email verification
    return $user->hasRole('workflow-manager') && 
           $user->hasVerifiedEmail();
});
```

### Example 6: IP Whitelist

```php
WorkflowStudio::auth(function ($request) {
    $allowedIPs = [
        '127.0.0.1',
        '192.168.1.100',
    ];
    
    return in_array($request->ip(), $allowedIPs) ||
           $request->user()?->isAdmin();
});
```

## Middleware Configuration

You can add additional middleware to WorkflowStudio routes in `config/workflowstudio.php`. The `web` middleware is always applied to ensure proper session handling, CSRF protection, and cookie encryption:

```php
return [
    // Additional middleware (web middleware is always included)
    'middleware' => ['auth', 'verified'],
    
    // Other configuration...
];
```

### Common Middleware Configurations

#### No Additional Middleware (Default)
```php
'middleware' => [],
```

#### Authenticated Users Only
```php
'middleware' => ['auth'],
```

#### Authenticated and Verified Users
```php
'middleware' => ['auth', 'verified'],
```

#### With Custom Middleware
```php
'middleware' => ['auth', 'verified', 'admin'],
```

**Note:** The `web` middleware group is always applied first and provides:
- Session state
- CSRF protection
- Cookie encryption
- Shared error handling
- Route model binding

## API Routes Security

API routes used by the WorkflowStudio interface are automatically protected with the same authorization logic. Both web and API routes require authorization via the `Authorize` middleware.

### API Endpoints Protected

- `GET /workflowstudio/api/actions` - List available actions
- `GET /workflowstudio/api/conditions` - List available conditions
- `GET /workflowstudio/api/triggers` - List available triggers
- `POST /workflowstudio/api/workflows/{id}/canvas` - Save workflow canvas
- `GET /workflowstudio/api/workflows/{id}/canvas` - Load workflow canvas
- `GET /workflowstudio/api/workflows/{id}/executions` - List workflow executions
- `GET /workflowstudio/api/workflows/{id}/executions/latest` - Get latest execution
- `GET /workflowstudio/api/workflows/{id}/executions/{executionId}` - Get execution details

## Custom Domain Configuration

You can host WorkflowStudio on a custom subdomain:

```php
// config/workflowstudio.php
return [
    'domain' => env('WORKFLOWSTUDIO_DOMAIN', null),
    'path' => env('WORKFLOWSTUDIO_PATH', 'workflowstudio'),
];
```

```env
WORKFLOWSTUDIO_DOMAIN=workflows.example.com
WORKFLOWSTUDIO_PATH=admin
```

With this configuration, WorkflowStudio will be accessible at:
- `https://workflows.example.com/admin/workflows`

## Testing Authorization

You can test your authorization configuration by:

1. **Local Environment**: Access should work without authentication
2. **Production Environment**: 
   - Try accessing without authentication (should fail)
   - Login with non-authorized user (should return 403)
   - Login with authorized user (should work)

## Best Practices

1. **Always require authentication in production**
   ```php
   WorkflowStudio::auth(function ($request) {
       return app()->environment('local') || $request->user()?->isAdmin();
   });
   ```

2. **Use environment-aware logic**
   - Different rules for local, staging, and production

3. **Limit access to trusted users**
   - Workflow management is powerful; restrict to admins or specific roles

4. **Consider IP whitelisting for sensitive environments**
   - Add an extra layer of security

5. **Log access attempts**
   ```php
   WorkflowStudio::auth(function ($request) {
       $authorized = $request->user()?->isAdmin();
       
       if (!$authorized) {
           \Log::warning('Unauthorized WorkflowStudio access attempt', [
               'user_id' => $request->user()?->id,
               'ip' => $request->ip(),
           ]);
       }
       
       return $authorized;
   });
   ```

## Troubleshooting

### "403 Forbidden" Error

If you're getting a 403 error:

1. Check your authorization callback in `AppServiceProvider`
2. Verify you're authenticated (if required)
3. Confirm your user meets the authorization criteria
4. Check middleware configuration in `config/workflowstudio.php`

### Authorization Not Working in Local

Ensure you haven't accidentally blocked local access:

```php
// ✅ Good - allows local access
WorkflowStudio::auth(function ($request) {
    return app()->environment('local') || $request->user()?->isAdmin();
});

// ❌ Bad - blocks local access
WorkflowStudio::auth(function ($request) {
    return $request->user()?->isAdmin(); // Always requires admin, even locally
});
```

### API Requests Failing

Both web and API routes use the same authorization. Ensure:
1. Your frontend is making authenticated requests
2. Session cookies are being sent with requests
3. CSRF tokens are included (for web middleware)
