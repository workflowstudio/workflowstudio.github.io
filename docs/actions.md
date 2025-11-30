---
title: In second action
---

Actions perform operations, send notifications, modify data, or interact with external systems.

## Available Actions

### Send Email

Send emails with dynamic content using Laravel's mail system.

**Type:** `send_mail`

**Settings:**
```yaml
to: {{ trigger.model_data.email }}
subject: Welcome!
body: Hello {{ trigger.model_data.name }}
from: noreply@example.com  # optional
```

**Context Variables:**
All fields support context variables:
```yaml
to: {{ trigger.model_data.email }}
subject: Order #{{ trigger.model_id }} Confirmed
body: |
  Hi {{ trigger.model_data.name }},
  
  Your order has been confirmed.
  Order ID: {{ trigger.model_id }}
  Status: {{ trigger.model_data.status }}
  
  Previous action result: {{ previous.success }}
```

**Output:**
```php
[
    'success' => true,
    'to' => 'user@example.com',
    'subject' => 'Welcome!',
    'sent_at' => '2025-11-25T10:30:00Z'
]
```

**Use Cases:**
- Welcome emails
- Order confirmations
- Password reset notifications
- Admin alerts
- Status updates

**Example:**
```
Trigger: User Created
    ↓
Action: Send Email
  to: {{ trigger.model_data.email }}
  subject: Welcome {{ trigger.model_data.name }}!
  body: Thanks for joining us!
```

---

### Webhook

Call external HTTP APIs with configurable methods, headers, and body.

**Type:** `webhook`

**Settings:**
```yaml
url: https://api.example.com/webhook
method: POST
headers:
  Content-Type: application/json
  Authorization: Bearer {{ previous.token }}
body: |
  {
    "user_id": {{ trigger.model_id }},
    "event": "user_created",
    "data": {
      "name": "{{ trigger.model_data.name }}",
      "email": "{{ trigger.model_data.email }}"
    }
  }
```

**Methods:**
- GET
- POST
- PUT
- PATCH
- DELETE

**Context Variables:**
All fields support variables:
```yaml
url: {{ trigger.model_data.webhook_url }}
headers:
  X-User-ID: {{ trigger.model_id }}
body: {{ previous.payload }}
```

**Output:**
```php
[
    'success' => true,
    'status' => 200,
    'body' => '{"success": true, "id": 123}',
    'json' => ['success' => true, 'id' => 123]
]
```

**Use Cases:**
- Third-party integrations
- Slack/Discord notifications
- CRM updates
- Analytics tracking
- External system sync

**Example:**
```
Trigger: Order Created
    ↓
Action: Webhook
  url: https://fulfillment.example.com/orders
  method: POST
  body: {
    "order_id": {{ trigger.model_id }},
    "items": {{ trigger.model_data.items }}
  }
```

---

### Update Model

Modify database records with dynamic attribute values.

**Type:** `update_model`

**Settings:**
```yaml
model_class: App\Models\User
model_id: {{ trigger.model_id }}
attributes:
  last_login: {{ previous.timestamp }}
  login_count: {{ previous.count }}
  status: active
```

**Context Variables:**
```yaml
model_id: {{ trigger.model_data.user_id }}
attributes:
  processed_at: {{ previous.completed_at }}
  processed_by: {{ previous.user_id }}
  result: {{ previous.status }}
```

**Output:**
```php
[
    'success' => true,
    'model_id' => 123,
    'model' => [
        'id' => 123,
        'last_login' => '2025-11-25T10:30:00Z',
        'login_count' => 5,
        // ... all model attributes
    ]
]
```

**Use Cases:**
- Update user profiles
- Mark records as processed
- Increment counters
- Set timestamps
- Update status fields

**Example:**
```
Trigger: User Updated
    ↓
Action: Update Model
  model_class: App\Models\UserProfile
  model_id: {{ trigger.model_id }}
  attributes:
    last_activity: {{ trigger.model_data.updated_at }}
    profile_updated: true
```

---

### Dispatch Job

Queue Laravel jobs for background processing.

**Type:** `dispatch_job`

**Settings:**
```yaml
job_class: App\Jobs\ProcessUser
parameters:
  user_id: {{ trigger.model_id }}
  action: welcome
  options: {{ previous.settings }}
```

**Context Variables:**
All parameters support variables:
```yaml
parameters:
  model_id: {{ trigger.model_id }}
  data: {{ trigger.model_data }}
  result: {{ previous.output }}
```

**Output:**
```php
[
    'success' => true,
    'job_id' => 'unique-job-id',
    'dispatched_at' => '2025-11-25T10:30:00Z'
]
```

**Use Cases:**
- Heavy processing tasks
- Image/video processing
- Report generation
- Bulk operations
- Async third-party calls

**Example:**
```
Trigger: Upload Created
    ↓
Action: Dispatch Job
  job_class: App\Jobs\ProcessImage
  parameters:
    file_path: {{ trigger.model_data.path }}
    user_id: {{ trigger.model_data.user_id }}
```

---

## Chaining Actions

Actions can be chained to create complex workflows:

```
Trigger: Order Created
    ↓
Action: Send Email to Customer
    ↓
Action: Webhook to Fulfillment
    ↓
Condition: previous.status equals 200
    ↓ TRUE                  ↓ FALSE
Action: Update Order     Action: Send Alert
    status: processing      to: admin@example.com
```

Each action's output is available to subsequent nodes:
```yaml
subject: Previous email sent at {{ node.45.sent_at }}
body: Webhook returned status {{ previous.status }}
```

## Using Context Variables

All actions support context variable interpolation:

### Syntax
```
{{ path.to.value }}
```

### Available Contexts

**Trigger Data:**
```yaml
{{ trigger.model }}
{{ trigger.event }}
{{ trigger.model_id }}
{{ trigger.model_data.field }}
```

**Node Output:**
```yaml
{{ node.123.success }}
{{ node.123.any_field }}
```

**Previous Node:**
```yaml
{{ previous.success }}
{{ previous.any_field }}
```

### Examples

**Dynamic Email Recipients:**
```yaml
to: {{ trigger.model_data.notification_email }}
cc: {{ trigger.model_data.manager_email }}
```

**Dynamic URLs:**
```yaml
url: https://{{ trigger.model_data.domain }}/api/webhook
```

**Dynamic Attributes:**
```yaml
attributes:
  updated_by: {{ previous.user_id }}
  updated_at: {{ previous.timestamp }}
```

**Nested Data:**
```yaml
{{ trigger.model_data.profile.address.city }}
{{ trigger.model_data.settings.notifications.email }}
{{ previous.response.data.user.id }}
```

## Action Output

Every action returns structured data:

```php
[
    'success' => bool,      // Whether action succeeded
    'data' => mixed,        // Primary result data
    // ... action-specific fields
]
```

Access in subsequent nodes:
```yaml
{{ previous.success }}
{{ previous.data }}
{{ node.45.sent_at }}
```

## Error Handling

Actions should handle errors gracefully:

```
Action: Webhook
    ↓
Condition: previous.success equals true
    ↓ TRUE              ↓ FALSE
Continue            Send Error Alert
```

Check action results:
```yaml
Condition: Equals
field: previous.success
value: true
```

## Common Patterns

### Pattern 1: Notify and Update

```
Trigger: Order Paid
    ↓
Action: Send Email (Receipt)
    ↓
Action: Update Model (Mark as Paid)
    ↓
Action: Webhook (Notify Fulfillment)
```

### Pattern 2: Conditional Actions

```
Trigger: User Created
    ↓
Condition: Email Domain
    ↓ TRUE              ↓ FALSE
Send Corporate      Send Standard
Welcome Email      Welcome Email
```

### Pattern 3: Retry Logic

```
Action: API Call
    ↓
Condition: Status equals 200
    ↓ TRUE              ↓ FALSE
Success Action      Retry Action
                        ↓
                    (loops back)
```

### Pattern 4: Fan-Out

```
Trigger: Order Created
    ↓
[Multiple parallel actions]
├─ Send Customer Email
├─ Send Admin Notification
├─ Webhook to Fulfillment
└─ Update Analytics
```

### Pattern 5: Aggregation

```
Action: Fetch Data A
    ↓
Action: Fetch Data B
    ↓
Action: Combine Results
  data_a: {{ node.50.result }}
  data_b: {{ node.51.result }}
```

## Best Practices

### 1. Use Context Variables

```yaml
✅ Good - Dynamic
to: {{ trigger.model_data.email }}

❌ Bad - Hardcoded
to: user@example.com
```

### 2. Check Previous Results

```yaml
Condition: previous.success equals true
    ↓ TRUE → Continue
    ↓ FALSE → Handle error
```

### 3. Descriptive Action Names

Label actions clearly in workflow description:
- "Send Welcome Email" not "Send Email"
- "Update User Profile" not "Update Model"

### 4. Handle Failures

Always have a FALSE branch for critical actions:

```
Action: Payment Process
    ↓
Condition: success
    ↓ TRUE          ↓ FALSE
Receipt         Refund & Notify
```

### 5. Keep Actions Focused

Each action should do one thing well:

```
✅ Good
Action: Send Email
Action: Update Model
Action: Webhook

❌ Bad
Action: Send Email and Update Model and Call Webhook
```

### 6. Use Queues

Actions run in queue jobs - ensure your queue worker is running:

```bash
php artisan queue:work
```

### 7. Log Important Actions

Add logging in custom actions:

```php
Log::info('Email sent', [
    'to' => $to,
    'subject' => $subject,
]);
```

## Testing Actions

### Manual Testing

```php
use App\Models\User;

$user = User::factory()->create([
    'email' => 'test@example.com',
]);

// Trigger workflow
// Check email was sent
// Check database updated
```

### Queue Testing

```php
Queue::fake();

// Trigger workflow
$user = User::create([...]);

// Assert job dispatched
Queue::assertPushed(RunWorkflow::class);
```

### Email Testing

```php
Mail::fake();

// Trigger workflow

Mail::assertSent(function ($mail) {
    return $mail->hasTo('test@example.com');
});
```

## Creating Custom Actions

See [Creating Custom Nodes](./custom-nodes.md#creating-a-custom-action) for detailed guide.

Quick example:

```php
class SendSlackMessageAction extends AbstractAction
{
    public function execute(array $settings, array $context)
    {
        $message = $this->resolveValue($settings['message'], $context);
        
        // Send to Slack
        $slack->send($message);
        
        return [
            'success' => true,
            'sent_at' => now()->toISOString(),
        ];
    }
}
```

## Troubleshooting

### Action Not Executing

1. Check queue worker is running
2. Check workflow is active
3. Check trigger fired
4. Check condition passed (if any)
5. Check logs for errors

### Variables Not Resolving

1. Verify context path is correct
2. Check field exists in context
3. Test with debug email action
4. Check logs for resolution errors

### Email Not Sending

1. Check mail configuration
2. Verify SMTP settings
3. Check mail logs
4. Test with `php artisan tinker`

## Next Steps

- Learn about [Context Variables](./context-variables.md)
- Explore [Conditions](./conditions.md) for conditional branching
- Create [Custom Actions](./custom-nodes.md)
