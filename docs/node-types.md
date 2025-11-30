---
title: Node Types
---

WorkflowStudio has three main types of nodes: Triggers, Conditions, and Actions.

## Node Anatomy

Every node has:
- **Type**: trigger, condition, or action
- **Subtype**: The specific implementation (e.g., "model.created", "equals", "send_mail")
- **Settings**: Configuration specific to the node
- **Position**: X/Y coordinates on the canvas
- **Connections**: Links to other nodes

## Triggers

Triggers are the starting point of every workflow. They define what event initiates the workflow.

### Characteristics
- ✅ Must be the first node in a workflow
- ✅ One trigger per workflow
- ✅ Cannot have incoming connections
- ✅ Provides initial context data

### Available Triggers

#### Model Created
Fires when a new model instance is created.

```yaml
Settings:
  model: App\Models\User
```

Context provided:
```php
[
    'model' => 'App\Models\User',
    'event' => 'created',
    'model_id' => 123,
    'model_data' => [ /* model attributes */ ]
]
```

#### Model Updated
Fires when an existing model is updated.

```yaml
Settings:
  model: App\Models\Post
```

#### Model Deleted
Fires when a model is soft or hard deleted.

```yaml
Settings:
  model: App\Models\Comment
```

## Conditions

Conditions evaluate to TRUE or FALSE and control workflow branching.

### Characteristics
- ✅ Evaluates an expression
- ✅ Returns boolean (true/false)
- ✅ Supports TRUE/FALSE branch paths
- ✅ Can access context variables

### Available Conditions

#### Equals
Checks if two values are equal.

```yaml
Settings:
  field: trigger.model_data.status
  value: active
```

Returns `true` if field equals value.

#### Contains
Checks if a string contains a substring.

```yaml
Settings:
  field: trigger.model_data.email
  value: @company.com
```

Returns `true` if email contains "@company.com".

#### Greater Than
Numeric comparison (>).

```yaml
Settings:
  field: trigger.model_data.age
  value: 18
```

Returns `true` if age > 18.

#### Less Than
Numeric comparison (<).

```yaml
Settings:
  field: trigger.model_data.price
  value: 100
```

Returns `true` if price < 100.

## Actions

Actions perform operations and can modify data, send notifications, or interact with external systems.

### Characteristics
- ✅ Executes an operation
- ✅ Can access context variables
- ✅ Returns output for next nodes
- ✅ Can be chained together

### Available Actions

#### Send Email

Send emails with dynamic content.

```yaml
Settings:
  to: {{ trigger.model_data.email }}
  subject: Welcome!
  body: Hello {{ trigger.model_data.name }}
  from: noreply@example.com (optional)
```

Output:
```php
[
    'success' => true,
    'to' => 'user@example.com',
    'subject' => 'Welcome!',
    'sent_at' => '2025-11-25T10:30:00Z'
]
```

#### Webhook

Call external HTTP APIs.

```yaml
Settings:
  url: https://api.example.com/webhook
  method: POST
  headers:
    Content-Type: application/json
    Authorization: Bearer token123
  body: |
    {
      "user_id": {{ trigger.model_id }},
      "event": "user_created"
    }
```

Output:
```php
[
    'success' => true,
    'status' => 200,
    'body' => '{"success": true}',
    'json' => ['success' => true]
]
```

#### Update Model

Modify database records.

```yaml
Settings:
  model_class: App\Models\User
  model_id: {{ trigger.model_id }}
  attributes:
    last_activity: {{ previous.timestamp }}
    status: active
```

Output:
```php
[
    'success' => true,
    'model_id' => 123,
    'model' => [ /* updated model data */ ]
]
```

#### Dispatch Job

Queue a Laravel job.

```yaml
Settings:
  job_class: App\Jobs\ProcessUser
  parameters:
    user_id: {{ trigger.model_id }}
    action: welcome
```

Output:
```php
[
    'success' => true,
    'job_id' => 'unique-job-id',
    'dispatched_at' => '2025-11-25T10:30:00Z'
]
```

## Node Connection Rules

### Valid Connections

```
✅ Trigger → Condition
✅ Trigger → Action
✅ Condition → Action
✅ Action → Action
✅ Action → Condition
```

### Invalid Connections

```
❌ Action → Trigger
❌ Condition → Trigger
❌ Trigger → Trigger
```

### Branch Connections

Only condition nodes support TRUE/FALSE branches:

```
Condition
  ↓ TRUE → Action A
  ↓ FALSE → Action B
```

Other nodes execute all connected nodes:

```
Action
  ↓ → Action A
  ↓ → Action B
  (Both execute)
```

## Node Configuration

### Opening Settings

Click on any node to open its settings panel on the right side.

### Settings Schema

Each node type has a JSON schema defining its configuration:

```php
[
    'type' => 'object',
    'properties' => [
        'field_name' => [
            'type' => 'string',
            'title' => 'Display Name',
            'description' => 'Help text',
        ]
    ],
    'required' => ['field_name']
]
```

### Field Types

- **string**: Text input
- **select**: Dropdown menu
- **textarea**: Multi-line text
- **email**: Email input with validation
- **uri**: URL input with validation
- **object**: Key-value pairs

## Node Output

Every node can return data that subsequent nodes can access:

```php
// Trigger output
[
    'model' => 'App\Models\User',
    'event' => 'created',
    'model_data' => [...]
]

// Condition output
true | false

// Action output
[
    'success' => true,
    'data' => [...]
]
```

Access output using:
```
{{ node.123.success }}
{{ previous.data }}
```

## Best Practices

### 1. One Trigger Per Workflow
Each workflow should have exactly one trigger node.

### 2. Meaningful Node Positioning
Organize nodes top-to-bottom or left-to-right for readability.

### 3. Clear Settings
Use context variables for dynamic values:
```
✅ to: {{ trigger.model_data.email }}
❌ to: hardcoded@example.com
```

### 4. Error Handling
Add conditions to check action results:
```
Action
  ↓
Condition: previous.success equals true
  ↓ TRUE → Continue
  ↓ FALSE → Error notification
```

### 5. Node Naming
Consider adding comments in workflow description to document node IDs and purposes.

## Next Steps

- Explore specific [Triggers](./triggers.md)
- Learn about [Conditions](./conditions.md)
- Master [Actions](./actions.md)
- Understand [Context Variables](./context-variables.md)
