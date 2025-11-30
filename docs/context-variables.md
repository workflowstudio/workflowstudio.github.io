---
title: Context Variables
---

Context variables allow you to pass data between nodes in your workflow. They use the <code>&#123;&#123; variable.path &#125;&#125;</code> syntax.

## Context Structure

The workflow context has the following structure:

```php
[
    'trigger' => [
        'model' => 'App\\Models\\User',
        'event' => 'created',
        'model_id' => 123,
        'model_data' => [
            'id' => 123,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            // ... all model attributes
        ]
    ],
    'node' => [
        '45' => [
            'success' => true,
            'to' => 'john@example.com',
            'sent_at' => '2025-11-25T10:30:00Z'
        ],
        '46' => [
            'status' => 200,
            'body' => '{"success": true}',
            'json' => ['success' => true]
        ]
    ],
    'previous' => [
        'success' => true,
        'model_id' => 123,
        'model' => [...]
    ]
]
```

## Accessing Trigger Data

Access data from the workflow trigger:

### Basic Trigger Data
```
{{ trigger.model }}        // 'App\Models\User'
{{ trigger.event }}        // 'created', 'updated', 'deleted'
{{ trigger.model_id }}     // 123
```

### Model Data
```
{{ trigger.model_data.id }}       // 123
{{ trigger.model_data.name }}     // 'John Doe'
{{ trigger.model_data.email }}    // 'john@example.com'
```

### Nested Data
```
{{ trigger.model_data.profile.bio }}
{{ trigger.model_data.settings.theme }}
{{ trigger.model_data.address.city }}
```

## Accessing Node Output

Access data from a specific node by its ID (use `previous` instead when possible):

```
{{ node.45.success }}         // true
{{ node.45.to }}              // 'john@example.com'
{{ node.45.sent_at }}         // '2025-11-25T10:30:00Z'
{{ node.46.status }}          // 200
{{ node.46.json.success }}    // true
```

**Note:** Prefer using `previous` for sequential workflows. Use `node.{id}` only when you need to reference a specific non-sequential node.

**Finding Node IDs:**
- Hover over a node in the canvas to see its ID in the tooltip
- Check the browser console when saving (logs show node IDs)
- Look at the URL when selecting a node

## Accessing Previous Node

Access output from the most recently executed node:

```
{{ previous.success }}
{{ previous.model_id }}
{{ previous.status }}
```

This is useful when nodes execute sequentially and you always want the last result.

## Usage Examples

### Send Email Action

```yaml
To: {{ trigger.model_data.email }}
Subject: Welcome {{ trigger.model_data.name }}!
Body: |
  Hi {{ trigger.model_data.name }},
  
  Your account ID is {{ trigger.model_id }}.
  You registered on {{ trigger.model_data.created_at }}.
```

### Webhook Action

```yaml
URL: https://api.example.com/users
Method: POST
Body: |
  {
    "user_id": {{ trigger.model_id }},
    "name": "{{ trigger.model_data.name }}",
    "email": "{{ trigger.model_data.email }}"
  }
```

### Update Model Action

```yaml
Model Class: App\Models\UserProfile
Model ID: {{ trigger.model_id }}
Attributes:
  last_login: {{ trigger.model_data.updated_at }}
  login_count: {{ previous.new_count }}
```

### Conditional Logic

```yaml
Field: {{ trigger.model_data.status }}
Value: active


Field: {{ trigger.model_data.age }}
Value: 18
```

## Chaining Node Outputs

You can chain multiple actions and reference their outputs:

```
Trigger: User Created (Node ID: 40)
    ↓
Action: Send Email (Node ID: 45)
    ↓
Action: Update Profile (Node ID: 50)
    ↓
Action: Webhook (Node ID: 55)
```

In the webhook (Node 55), you can reference:
```
{
  "email_sent_at": "{{ node.45.sent_at }}",
  "profile_updated": {{ node.50.success }},
  "user_name": "{{ trigger.model_data.name }}"
}
```

## Variable Resolution

Variables are resolved at execution time using the following rules:

1. **String interpolation**: Variables in strings are replaced with their values
2. **Nested access**: Use dot notation to access nested properties
3. **Fallback**: If a variable doesn't exist, the original <code>&#123;&#123; &#125;&#125;</code> syntax is preserved
4. **Type preservation**: Numbers and booleans are converted appropriately

## Best Practices

### 1. Use Descriptive Field Names
```
✅ {{ trigger.model_data.user_email }}
❌ {{ trigger.model_data.e }}
```

### 2. Handle Optional Fields
Check if fields exist before using them, or provide defaults in your logic.

### 3. Reference Node IDs
Keep track of node IDs in complex workflows by:
- Adding notes/comments in the workflow description
- Using consistent node positioning
- Documenting the workflow structure

### 4. Test Variable Resolution
Before deploying:
- Test with sample data
- Check the queue logs for resolved values
- Verify null/missing field handling

## Common Patterns

### Email Notification with Previous Action Result
```yaml
To: admin@example.com
Subject: Workflow Completed
Body: |
  User {{ trigger.model_data.name }} was processed.
  Email sent: {{ node.45.success }}
  Profile updated: {{ node.50.success }}
```

### Conditional Webhook Based on Previous Result
```yaml
Condition: {{ previous.success }} equals true
TRUE Branch: Send success webhook
FALSE Branch: Send failure notification
```

### Dynamic Model Updates
```yaml
Model ID: {{ trigger.model_id }}
Attributes:
  processed_at: {{ previous.completed_at }}
  processor_id: {{ previous.user_id }}
  status: completed
```

## Debugging Context Variables

To debug context issues:

1. **Check Queue Logs**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Add Debug Email Action**
   Create an action that sends the full context to yourself:
   ```yaml
   Body: |
     Trigger Model: {{ trigger.model }}
     Trigger Data: {{ trigger.model_data }}
     Previous: {{ previous }}
   ```

3. **Use Browser Console**
   The workflow editor logs context when saving

## Next Steps

- Learn about [Conditions](./conditions.md) for conditional branching
- Explore [Actions](./actions.md)
- Create [Custom Nodes](./custom-nodes.md)
