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

## Webhook Triggers

Webhook triggers allow external services to trigger workflows via HTTP requests.

### Webhook

Fires when an HTTP request is received at the webhook URL.

**Type:** `webhook`

**Settings:**
```yaml
method: POST
secret: your-secret-token-here  # Optional, for validation
```

**Webhook URL:**
Each webhook trigger gets a unique URL:
```
https://your-app.com/workflowstudio/webhooks/{node-id}
```

**How to get the Node ID:**
1. Create a webhook trigger node in your workflow
2. Click on the webhook trigger node to open its settings panel
3. The webhook URL will be displayed in the settings panel (after saving the workflow)
4. The Node ID is the UUID part of the URL (e.g., `abc-123-def-456` in `/webhooks/abc-123-def-456`)
5. You can also find it by:
   - Looking at the node ID in the browser's developer console
   - Checking the workflow canvas data after saving
   - The Node ID is automatically generated when you save the workflow

**When it fires:**
```bash
# Using curl
curl -X POST https://your-app.com/workflowstudio/webhooks/abc-123-def \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-token-here" \
  -d '{"event": "payment.completed", "amount": 100}'
```

**Context provided:**
```php
[
    'trigger' => [
        'type' => 'webhook',
        'method' => 'POST',
        'url' => 'https://your-app.com/workflowstudio/webhooks/abc-123-def',
        'headers' => [
            'content-type' => ['application/json'],
            'x-webhook-secret' => ['your-secret-token-here'],
        ],
        'query' => [],
        'body' => [
            'event' => 'payment.completed',
            'amount' => 100,
        ],
        'ip' => '192.168.1.1',
        'user_agent' => 'curl/7.68.0',
        'timestamp' => '2025-11-30T10:30:00Z',
    ]
]
```

**Security:**
- Optional secret validation via `X-Webhook-Secret` header, query parameter, or body field
- If secret is configured, requests without valid secret are rejected
- If secret is empty, all requests are accepted

**Supported HTTP Methods:**
- GET
- POST
- PUT
- PATCH
- DELETE

**Accessing Webhook Data:**
```php
// In conditions
Value1: trigger.body.event
Value2: payment.completed

// In actions
URL: {{ trigger.body.webhook_url }}
Body: {{ trigger.body.data }}
```

## Scheduled Triggers

Scheduled triggers allow workflows to run automatically on a schedule using cron expressions or predefined intervals.

### Scheduled

Fires on a schedule based on cron expression or predefined intervals.

**Type:** `scheduled`

**Settings:**
```yaml
schedule_type: daily  # cron, daily, weekly, monthly, hourly, every_minute, etc.
time: 09:00          # Time in 24-hour format (for daily, weekly, monthly)
cron_expression: "0 9 * * *"  # Custom cron expression (when schedule_type is "cron")
day_of_week: 1       # Day of week for weekly (0=Sunday, 6=Saturday)
day_of_month: 1      # Day of month for monthly (1-31)
```

**Schedule Types:**
- `cron` - Custom cron expression
- `daily` - Runs once per day at specified time
- `weekly` - Runs once per week on specified day and time
- `monthly` - Runs once per month on specified day and time
- `hourly` - Runs every hour at minute 0
- `every_minute` - Runs every minute
- `every_five_minutes` - Runs every 5 minutes
- `every_ten_minutes` - Runs every 10 minutes
- `every_fifteen_minutes` - Runs every 15 minutes
- `every_thirty_minutes` - Runs every 30 minutes

**When it fires:**
```php
// Daily at 9:00 AM
schedule_type: daily
time: 09:00

// Weekly on Monday at 9:00 AM
schedule_type: weekly
time: 09:00
day_of_week: 1

// Monthly on the 1st at 9:00 AM
schedule_type: monthly
time: 09:00
day_of_month: 1

// Custom cron: Every weekday at 9 AM
schedule_type: cron
cron_expression: "0 9 * * 1-5"
```

**Context provided:**
```php
[
    'trigger' => [
        'type' => 'scheduled',
        'schedule_type' => 'daily',
        'cron_expression' => '0 9 * * *',
        'triggered_at' => '2025-11-30T09:00:00Z',
    ]
]
```

**Setup Required:**
The scheduled command is automatically registered by the package. You only need to ensure Laravel's scheduler is running:

```bash
# Add to crontab
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

The command `workflowstudio:run-scheduled` will automatically run every minute to check for due scheduled workflows.

**Accessing Scheduled Data:**
```php
// In conditions
Value1: trigger.schedule_type
Value2: daily

// In actions
Message: Workflow triggered at {{ trigger.triggered_at }}
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

### External Service Integration

```
Trigger: Webhook (Payment Service)
    ↓
Condition: trigger.body.status equals "completed"
    ↓ TRUE
Action: Update Order Status
    ↓
Action: Send Confirmation Email
```

### Third-Party Notifications

```
Trigger: Webhook (Stripe)
    ↓
Condition: trigger.body.type equals "payment_intent.succeeded"
    ↓ TRUE
Action: Update Subscription
    ↓
Action: Send Receipt
```

### Daily Reports

```
Trigger: Scheduled (Daily at 9 AM)
    ↓
Action: Generate Report
    ↓
Action: Send Email with Report
```

### Weekly Cleanup

```
Trigger: Scheduled (Weekly on Sunday)
    ↓
Action: Clean Old Records
    ↓
Action: Archive Data
    ↓
Action: Send Summary Email
```

### Hourly Monitoring

```
Trigger: Scheduled (Every Hour)
    ↓
Condition: System Health Check
    ↓ TRUE              ↓ FALSE
Send OK Status      Send Alert
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
- Model triggers: Only Eloquent models supported
- Requires queue worker running
- No retroactive triggers (won't process existing data)
- Webhook triggers: Publicly accessible (use secret for security)

## Next Steps

- Learn about [Conditions](./conditions.md)
- Explore [Actions](./actions.md)
- Understand [Context Variables](./context-variables.md)
