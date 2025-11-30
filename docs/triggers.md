---
title: Triggers
---

Triggers are the starting point of every workflow. They listen for specific events and initiate workflow execution.

## Overview

Triggers:
- Start workflow execution
- Provide initial context data
- Can only be the first node in a workflow
- One per workflow

## Model Triggers

Model triggers listen to Eloquent model events.

### Model Created

Fires when a new model instance is created in the database.

**Type:** `model.created`

**Settings:**
```yaml
model: App\Models\User
```

**When it fires:**
```php
User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
]);
// Workflow triggered with user data
```

**Context provided:**
```php
[
    'trigger' => [
        'model' => 'App\Models\User',
        'event' => 'created',
        'model_id' => 123,
        'model_data' => [
            'id' => 123,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'created_at' => '2025-11-25T10:30:00Z',
            'updated_at' => '2025-11-25T10:30:00Z',
        ]
    ]
]
```

### Model Updated

Fires when an existing model is updated.

**Type:** `model.updated`

**Settings:**
```yaml
model: App\Models\Post
```

**When it fires:**
```php
$post = Post::find(1);
$post->update(['title' => 'New Title']);
// Workflow triggered with updated post data
```

**Context provided:**
```php
[
    'trigger' => [
        'model' => 'App\Models\Post',
        'event' => 'updated',
        'model_id' => 1,
        'model_data' => [
            'id' => 1,
            'title' => 'New Title',
            'content' => '...',
            'updated_at' => '2025-11-25T10:35:00Z',
        ]
    ]
]
```

### Model Deleted

Fires when a model is deleted (both soft and hard deletes).

**Type:** `model.deleted`

**Settings:**
```yaml
model: App\Models\Comment
```

**When it fires:**
```php
$comment = Comment::find(5);
$comment->delete();
// Workflow triggered with comment data before deletion
```

**Context provided:**
```php
[
    'trigger' => [
        'model' => 'App\Models\Comment',
        'event' => 'deleted',
        'model_id' => 5,
        'model_data' => [
            'id' => 5,
            'content' => '...',
            'deleted_at' => '2025-11-25T10:40:00Z',
        ]
    ]
]
```

## Configuration

Configure which models should be observed in `config/workflowstudio.php`:

```php
return [
    'observed_models' => [
        \App\Models\User::class,
        \App\Models\Post::class,
        \App\Models\Comment::class,
        \App\Models\Order::class,
    ],
];
```

## How It Works

### 1. Model Observer

WorkflowStudio automatically registers a model observer for each configured model:

```php
User::observe(ModelObserver::class);
```

### 2. Event Detection

When a model event occurs, the observer catches it:

```php
public function created(Model $model)
{
    WorkflowTrigger::handle('created', $model);
}
```

### 3. Workflow Matching

The system finds all active workflows with matching trigger configurations:

```php
Workflow::where('is_active', true)
    ->whereHas('nodes', function ($query) use ($event, $model) {
        $query->where('type', 'trigger')
            ->where('subtype', "model.{$event}")
            ->whereJsonContains('settings->model', get_class($model));
    })
    ->get();
```

### 4. Workflow Execution

Each matching workflow is dispatched to the queue:

```php
RunWorkflow::dispatch($workflow->id, $triggerContext);
```

## Trigger Context

The trigger provides a rich context that can be accessed in subsequent nodes:

```php
// Access in conditions
Field: trigger.model_data.status
Value: active

// Access in actions
To: {{ trigger.model_data.email }}
Subject: Hello {{ trigger.model_data.name }}
Body: Your ID is {{ trigger.model_id }}
```

## Use Cases

### New User Welcome Flow

```
Trigger: User Created
    ↓
Action: Send Welcome Email
    ↓
Action: Create User Profile
    ↓
Action: Send Slack Notification
```

### Order Processing

```
Trigger: Order Created
    ↓
Condition: Amount > 100
    ↓ TRUE              ↓ FALSE
Send VIP Email      Send Standard Email
    ↓                   ↓
Webhook: Notify     Webhook: Notify
Fulfillment         Standard Processing
```

### Content Moderation

```
Trigger: Comment Created
    ↓
Condition: Contains Bad Words
    ↓ TRUE              ↓ FALSE
Flag for Review     Auto-Approve
    ↓                   ↓
Send Admin Alert    Notify Author
```

### User Activity Tracking

```
Trigger: User Updated
    ↓
Condition: Last Login Changed
    ↓ TRUE
Update Analytics
    ↓
Send Activity Report
```

## Best Practices

### 1. Specific Models Only

Only observe models that need workflow automation:

```php
// ✅ Good - Only models with workflows
'observed_models' => [
    \App\Models\User::class,
    \App\Models\Order::class,
]

// ❌ Bad - Too many models
'observed_models' => [
    \App\Models\User::class,
    \App\Models\Session::class,  // High frequency, probably not needed
    \App\Models\Log::class,      // High frequency, probably not needed
]
```

### 2. Use Conditions for Filtering

Instead of triggering for all model events, use conditions to filter:

```
Trigger: User Updated
    ↓
Condition: Email Changed
    ↓ TRUE
Send Email Verification
```

### 3. Handle Queue Failures

Monitor your queue for failed workflow jobs:

```bash
php artisan queue:failed
```

### 4. Test Triggers

Test your triggers in a development environment:

```php
// Create test data
User::factory()->create(['name' => 'Test User']);

// Check queue for RunWorkflow job
php artisan queue:work --once

// Check logs
tail -f storage/logs/laravel.log
```

## Trigger Conditions (Advanced)

Triggers support optional conditions to filter when they fire:

```php
// In trigger settings (future feature)
conditions:
  - field: email
    operator: contains
    value: '@company.com'
```

This ensures the workflow only triggers for company email addresses.

## Performance Considerations

### Queue Configuration

Use queues for workflow execution to avoid blocking requests:

```env
QUEUE_CONNECTION=database
QUEUE_CONNECTION=redis
```

### Bulk Operations

For bulk model operations, consider:

```php
// ✅ Good - Disable observers temporarily
User::withoutEvents(function () {
    User::factory()->count(1000)->create();
});

// ❌ Bad - Triggers 1000 workflows
User::factory()->count(1000)->create();
```

### High-Frequency Models

Avoid workflows on high-frequency models like sessions, logs, or audit trails.

## Debugging

### Check if Trigger Fired

```php
// Check jobs table
DB::table('jobs')->where('queue', 'default')->get();

// Check failed jobs
php artisan queue:failed
```

### Log Trigger Events

```php
Log::info('Workflow triggered', [
    'workflow_id' => $workflow->id,
    'model' => get_class($model),
    'model_id' => $model->getKey(),
]);
```

### Test Manually

```php
use WorkflowStudio\Services\WorkflowTrigger;

$user = User::find(1);
WorkflowTrigger::handle('created', $user);
```

## Limitations

- One trigger per workflow
- Only Eloquent models supported
- Requires queue worker running
- No retroactive triggers (won't process existing data)

## Next Steps

- Learn about [Conditions](./conditions.md)
- Explore [Actions](./actions.md)
- Understand [Context Variables](./context-variables.md)
