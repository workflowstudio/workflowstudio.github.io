---
title: API Reference
---

Complete API documentation for WorkflowStudio.

## REST API Endpoints

### Workflows

#### Get Canvas Data

Load workflow nodes and connections.

```http
GET /workflowstudio/api/workflows/{workflowId}/canvas
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "123",
        "type": "trigger",
        "subtype": "model.created",
        "position_x": 100,
        "position_y": 150,
        "settings": {
          "model": "App\\Models\\User"
        }
      }
    ],
    "connections": [
      {
        "id": "1",
        "source": "123",
        "target": "124",
        "branch_type": "true"
      }
    ]
  }
}
```

#### Save Canvas Data

Save workflow nodes and connections.

```http
POST /workflowstudio/api/workflows/{workflowId}/canvas
Content-Type: application/json
```

**Request:**
```json
{
  "nodes": [
    {
      "id": "temp-123",
      "type": "trigger",
      "subtype": "model.created",
      "position_x": 100,
      "position_y": 150,
      "settings": {
        "model": "App\\Models\\User"
      }
    }
  ],
  "connections": [
    {
      "source": "temp-123",
      "target": "temp-124",
      "branch_type": "true"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow canvas saved successfully.",
  "data": {
    "node_id_map": {
      "temp-123": 123,
      "temp-124": 124
    }
  }
}
```

#### Get Actions

List available action types.

```http
GET /workflowstudio/api/actions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "send_mail",
      "title": "Send Email",
      "settings_schema": { ... },
      "validation_rules": { ... }
    }
  ]
}
```

#### Get Conditions

List available condition types.

```http
GET /workflowstudio/api/conditions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "equals",
      "title": "Equals",
      "settings_schema": { ... },
      "validation_rules": { ... }
    }
  ]
}
```

#### Get Triggers

List available trigger types.

```http
GET /workflowstudio/api/triggers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "model.created",
      "title": "Model Created",
      "settings_schema": { ... },
      "validation_rules": { ... }
    }
  ]
}
```

## PHP API

### WorkflowRunner

Execute workflows programmatically.

```php
use WorkflowStudio\Services\WorkflowRunner;
use WorkflowStudio\Models\Workflow;

$workflow = Workflow::find(1);
$runner = app(WorkflowRunner::class);

$runner->run($workflow, [
    'model' => 'App\Models\User',
    'event' => 'created',
    'model_id' => 123,
    'model_data' => $user->toArray(),
]);
```

### WorkflowTrigger

Trigger workflows manually.

```php
use WorkflowStudio\Services\WorkflowTrigger;
use App\Models\User;

$user = User::find(1);

WorkflowTrigger::handle('created', $user);
// Finds and dispatches matching workflows
```

### Registries

#### ActionRegistry

Register and retrieve actions.

```php
use WorkflowStudio\Registry\ActionRegistry;
use App\Actions\CustomAction;

// Register
ActionRegistry::register('custom', CustomAction::class);

// Retrieve
$actionClass = ActionRegistry::get('custom');

// Get all
$actions = ActionRegistry::all();
```

#### ConditionRegistry

Register and retrieve conditions.

```php
use WorkflowStudio\Registry\ConditionRegistry;
use App\Conditions\CustomCondition;

// Register
ConditionRegistry::register('custom', CustomCondition::class);

// Retrieve
$conditionClass = ConditionRegistry::get('custom');

// Get all
$conditions = ConditionRegistry::all();
```

#### TriggerRegistry

Register and retrieve triggers.

```php
use WorkflowStudio\Registry\TriggerRegistry;
use App\Triggers\CustomTrigger;

// Register
TriggerRegistry::register('custom', CustomTrigger::class);

// Retrieve
$triggerClass = TriggerRegistry::get('custom');

// Get all
$triggers = TriggerRegistry::all();
```

### ConditionEvaluator

Evaluate conditions.

```php
use WorkflowStudio\Services\ConditionEvaluator;

$evaluator = app(ConditionEvaluator::class);

$result = $evaluator->evaluate('equals', [
    'field' => 'trigger.model_data.status',
    'value' => 'active'
], $context);

// Returns: true or false
```

## Models

### Workflow

```php
use WorkflowStudio\Models\Workflow;

// Properties
$workflow->id;
$workflow->name;
$workflow->description;
$workflow->is_active;
$workflow->created_at;
$workflow->updated_at;

// Relationships
$workflow->nodes;           // HasMany
$workflow->triggerNode;     // HasOne (first trigger node)

// Methods
$workflow->activate();
$workflow->deactivate();
```

### Node

```php
use WorkflowStudio\Models\Node;

// Properties
$node->id;
$node->workflow_id;
$node->type;                // 'trigger', 'condition', 'action'
$node->subtype;             // 'model.created', 'equals', 'send_mail'
$node->position_x;
$node->position_y;
$node->settings;            // Array

// Relationships
$node->workflow;            // BelongsTo
$node->outgoingConnections; // HasMany
$node->incomingConnections; // HasMany

// Casts
$node->settings             // Array (JSON cast)
```

### NodeConnection

```php
use WorkflowStudio\Models\NodeConnection;

// Properties
$connection->id;
$connection->source_node_id;
$connection->target_node_id;
$connection->branch_type;   // 'true', 'false', null

// Relationships
$connection->sourceNode;    // BelongsTo
$connection->targetNode;    // BelongsTo
```

## Contracts

### ActionContract

Interface for all actions.

```php
interface ActionContract
{
    public static function type(): string;
    public static function title(): string;
    public static function settingsSchema(): array;
    public static function validationRules(): array;
    public function execute(array $settings, array $context);
}
```

### ConditionContract

Interface for all conditions.

```php
interface ConditionContract
{
    public static function type(): string;
    public static function title(): string;
    public static function settingsSchema(): array;
    public static function validationRules(): array;
    public function evaluate(array $settings, array $context): bool;
}
```

### TriggerContract

Interface for all triggers.

```php
interface TriggerContract
{
    public static function type(): string;
    public static function title(): string;
    public static function settingsSchema(): array;
    public static function validationRules(): array;
}
```

## Jobs

### RunWorkflow

Queue job for executing workflows.

```php
use WorkflowStudio\Jobs\RunWorkflow;

// Dispatch
RunWorkflow::dispatch($workflowId, $triggerContext);

// Dispatch with delay
RunWorkflow::dispatch($workflowId, $triggerContext)
    ->delay(now()->addMinutes(5));

// Dispatch to specific queue
RunWorkflow::dispatch($workflowId, $triggerContext)
    ->onQueue('workflows');
```

## Events

WorkflowStudio uses Laravel's model events:

```php
// User model events trigger workflows
User::creating();   // Before created
User::created();    // After created (triggers workflow)
User::updating();   // Before updated
User::updated();    // After updated (triggers workflow)
User::deleting();   // Before deleted
User::deleted();    // After deleted (triggers workflow)
```

## Configuration

### config/workflowstudio.php

```php
return [
    // Models to observe for workflow triggers
    'observed_models' => [
        \App\Models\User::class,
        \App\Models\Post::class,
    ],
];
```

## Database Schema

### workflows

```sql
CREATE TABLE workflows (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### nodes

```sql
CREATE TABLE nodes (
    id BIGINT PRIMARY KEY,
    workflow_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    subtype VARCHAR(100) NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    settings JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
);
```

### node_connections

```sql
CREATE TABLE node_connections (
    id BIGINT PRIMARY KEY,
    source_node_id BIGINT NOT NULL,
    target_node_id BIGINT NOT NULL,
    branch_type VARCHAR(10),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE KEY (source_node_id, target_node_id),
    FOREIGN KEY (source_node_id) REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (target_node_id) REFERENCES nodes(id) ON DELETE CASCADE
);
```

## JavaScript API

### Initialize Editor

```javascript
window.initWorkflowStudioEditor({
    workflowId: 1,
    nodes: [...],
    connections: [...]
});
```

### Custom Events

```javascript
// Node updated
window.addEventListener('workflowstudio:nodeUpdated', (event) => {
    console.log('Nodes:', event.detail.nodes);
    console.log('Connections:', event.detail.connections);
});

// Save workflow
window.dispatchEvent(new CustomEvent('workflowstudio:save', {
    detail: {
        workflowId: 1,
        nodes: [...],
        connections: [...]
    }
}));
```

## Error Handling

### API Errors

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error",
  "errors": {
    "field": ["Validation error"]
  }
}
```

**Status Codes:**
- `200` - Success
- `422` - Validation Error
- `500` - Server Error

### Queue Failures

Check failed jobs:

```bash
php artisan queue:failed
```

Retry failed jobs:

```bash
php artisan queue:retry all
```

## Performance

### Optimize Queries

```php
// Eager load relationships
$workflow = Workflow::with([
    'nodes.outgoingConnections.targetNode'
])->find(1);
```

### Queue Configuration

Use Redis for better performance:

```env
QUEUE_CONNECTION=redis
REDIS_CLIENT=phpredis
```

### Caching

Cache registry lookups:

```php
Cache::remember('workflowstudio.actions', 3600, function () {
    return ActionRegistry::all();
});
```

## Testing

### Test Helpers

```php
use WorkflowStudio\Models\Workflow;
use WorkflowStudio\Models\Node;

// Create test workflow
$workflow = Workflow::factory()->create();

// Create test node
$node = Node::factory()->create([
    'workflow_id' => $workflow->id,
    'type' => 'trigger',
]);
```

### Mock Actions

```php
use WorkflowStudio\Registry\ActionRegistry;

ActionRegistry::register('test', TestAction::class);
```

## Next Steps

- Explore [Custom Nodes](./custom-nodes.md)
- Review [Context Variables](./context-variables.md)
- See [Getting Started](./getting-started.md) for example workflows
