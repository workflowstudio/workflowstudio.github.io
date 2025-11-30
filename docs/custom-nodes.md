---
title: Creating Custom Nodes
---

Extend WorkflowStudio by creating custom triggers, conditions, and actions.

## Overview

Custom nodes allow you to:
- Add custom business logic
- Integrate with third-party services
- Implement domain-specific workflows
- Extend functionality without modifying core code

## Creating a Custom Action

### Step 1: Create the Action Class

Create a new class extending `AbstractAction`:

```php
<?php

namespace App\WorkflowStudio\Actions;

use WorkflowStudio\Actions\AbstractAction;
use App\Services\SlackService;

class SendSlackMessageAction extends AbstractAction
{
    public static function type(): string
    {
        return 'send_slack';
    }

    public static function title(): string
    {
        return 'Send Slack Message';
    }

    public static function settingsSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'channel' => [
                    'type' => 'string',
                    'title' => 'Channel',
                    'description' => 'Slack channel (e.g., #general)',
                ],
                'message' => [
                    'type' => 'string',
                    'title' => 'Message',
                    'format' => 'textarea',
                    'description' => 'Supports variables like {{ trigger.model_data.name }}',
                ],
                'username' => [
                    'type' => 'string',
                    'title' => 'Bot Username',
                    'default' => 'Workflow Bot',
                ],
            ],
            'required' => ['channel', 'message'],
        ];
    }

    public static function validationRules(): array
    {
        return [
            'channel' => ['required', 'string', 'starts_with:#'],
            'message' => ['required', 'string'],
            'username' => ['sometimes', 'string'],
        ];
    }

    public function execute(array $settings, array $context)
    {
        // Resolve context variables in settings
        $channel = $this->resolveValue($settings['channel'], $context);
        $message = $this->resolveValue($settings['message'], $context);
        $username = $this->resolveValue($settings['username'] ?? 'Workflow Bot', $context);

        // Execute the action
        $slack = app(SlackService::class);
        $response = $slack->sendMessage($channel, $message, $username);

        // Return output for next nodes
        return [
            'success' => $response->successful(),
            'channel' => $channel,
            'message_id' => $response->json('ts'),
            'sent_at' => now()->toISOString(),
        ];
    }
}
```

### Step 2: Register the Action

In your `AppServiceProvider`:

```php
use WorkflowStudio\Registry\ActionRegistry;
use App\WorkflowStudio\Actions\SendSlackMessageAction;

public function boot()
{
    ActionRegistry::register(
        SendSlackMessageAction::type(),
        SendSlackMessageAction::class
    );
}
```

### Step 3: Use in Workflows

The action will now appear in the node library under "Actions".

## Creating a Custom Condition

### Step 1: Create the Condition Class

```php
<?php

namespace App\WorkflowStudio\Conditions;

use WorkflowStudio\Conditions\AbstractCondition;

class IsWeekendCondition extends AbstractCondition
{
    public static function type(): string
    {
        return 'is_weekend';
    }

    public static function title(): string
    {
        return 'Is Weekend';
    }

    public static function settingsSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'timezone' => [
                    'type' => 'string',
                    'title' => 'Timezone',
                    'default' => 'UTC',
                ],
            ],
        ];
    }

    public static function validationRules(): array
    {
        return [
            'timezone' => ['sometimes', 'timezone'],
        ];
    }

    public function evaluate(array $settings, array $context): bool
    {
        $timezone = $settings['timezone'] ?? 'UTC';
        $now = now($timezone);
        
        return $now->isWeekend();
    }
}
```

### Step 2: Register the Condition

```php
use WorkflowStudio\Registry\ConditionRegistry;
use App\WorkflowStudio\Conditions\IsWeekendCondition;

public function boot()
{
    ConditionRegistry::register(
        IsWeekendCondition::type(),
        IsWeekendCondition::class
    );
}
```

## Creating a Custom Trigger

### Step 1: Create the Trigger Class

```php
<?php

namespace App\WorkflowStudio\Triggers;

use WorkflowStudio\Triggers\AbstractTrigger;

class ScheduledTrigger extends AbstractTrigger
{
    public static function type(): string
    {
        return 'scheduled';
    }

    public static function title(): string
    {
        return 'Scheduled Trigger';
    }

    public static function settingsSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'schedule' => [
                    'type' => 'select',
                    'title' => 'Schedule',
                    'options' => ['daily', 'weekly', 'monthly'],
                ],
                'time' => [
                    'type' => 'string',
                    'title' => 'Time (24h)',
                    'pattern' => '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
                ],
            ],
            'required' => ['schedule', 'time'],
        ];
    }

    public static function validationRules(): array
    {
        return [
            'schedule' => ['required', 'in:daily,weekly,monthly'],
            'time' => ['required', 'regex:/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/'],
        ];
    }
}
```

### Step 2: Create the Scheduler Command

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use WorkflowStudio\Models\Workflow;
use WorkflowStudio\Jobs\RunWorkflow;

class TriggerScheduledWorkflows extends Command
{
    protected $signature = 'workflowstudio:trigger-scheduled';
    protected $description = 'Trigger scheduled workflows';

    public function handle()
    {
        $workflows = Workflow::where('is_active', true)
            ->whereHas('nodes', function ($query) {
                $query->where('type', 'trigger')
                    ->where('subtype', 'scheduled');
            })
            ->get();

        foreach ($workflows as $workflow) {
            $triggerNode = $workflow->nodes()
                ->where('type', 'trigger')
                ->where('subtype', 'scheduled')
                ->first();

            $settings = $triggerNode->settings ?? [];
            $now = now();

            // Check if it's time to trigger
            if ($this->shouldTrigger($settings, $now)) {
                RunWorkflow::dispatch($workflow->id, [
                    'triggered_at' => $now->toISOString(),
                    'schedule' => $settings['schedule'],
                ]);
            }
        }
    }

    protected function shouldTrigger(array $settings, $now): bool
    {
        // Implement scheduling logic
        $time = $settings['time'] ?? '00:00';
        [$hour, $minute] = explode(':', $time);

        return $now->hour == $hour && $now->minute == $minute;
    }
}
```

### Step 3: Register in Console Kernel

```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('workflowstudio:trigger-scheduled')
        ->everyMinute();
}
```

### Step 4: Register the Trigger

```php
use WorkflowStudio\Registry\TriggerRegistry;
use App\WorkflowStudio\Triggers\ScheduledTrigger;

public function boot()
{
    TriggerRegistry::register(
        ScheduledTrigger::type(),
        ScheduledTrigger::class
    );
}
```

## Using Context Variables

All custom nodes can use the `resolveValue()` method from `AbstractAction`:

```php
public function execute(array $settings, array $context)
{
    // Resolves {{ trigger.model_data.name }} and other variables
    $name = $this->resolveValue($settings['name'], $context);
    
    // Resolve all settings at once
    $resolved = $this->resolveSettings($settings, $context);
    
    // Your logic here
}
```

## Settings Schema Reference

### Field Types

```php
[
    'type' => 'string',      // Text input
    'type' => 'select',      // Dropdown
    'type' => 'textarea',    // Multi-line text
    'type' => 'object',      // Key-value pairs
]
```

### Field Attributes

```php
[
    'title' => 'Display Name',
    'description' => 'Help text',
    'default' => 'default value',
    'format' => 'email|uri|textarea',
    'pattern' => '^regex$',
    'options' => ['opt1', 'opt2'],  // For select
    'required' => ['field1', 'field2'],
]
```

## Validation Rules

Use Laravel validation rules:

```php
public static function validationRules(): array
{
    return [
        'email' => ['required', 'email'],
        'url' => ['required', 'url'],
        'count' => ['required', 'integer', 'min:1'],
        'status' => ['required', 'in:active,inactive'],
    ];
}
```

## Return Values

Actions should return structured data:

```php
return [
    'success' => true,          // Boolean indicating success
    'data' => $result,          // Main result data
    'metadata' => [...],        // Additional information
    'timestamp' => now()->toISOString(),
];
```

Conditions should return boolean:

```php
return $value > 100;  // true or false
```

## Error Handling

### In Actions

```php
public function execute(array $settings, array $context)
{
    try {
        // Your logic
        return ['success' => true, 'data' => $result];
    } catch (\Exception $e) {
        Log::error("Action failed: {$e->getMessage()}");
        return ['success' => false, 'error' => $e->getMessage()];
    }
}
```

### In Conditions

```php
public function evaluate(array $settings, array $context): bool
{
    try {
        // Your logic
        return $condition;
    } catch (\Exception $e) {
        Log::error("Condition evaluation failed: {$e->getMessage()}");
        return false;  // Default to false on error
    }
}
```

## Testing Custom Nodes

### Unit Test Example

```php
<?php

namespace Tests\Unit\WorkflowStudio;

use Tests\TestCase;
use App\WorkflowStudio\Actions\SendSlackMessageAction;

class SendSlackMessageActionTest extends TestCase
{
    public function test_sends_slack_message()
    {
        $action = new SendSlackMessageAction();
        
        $settings = [
            'channel' => '#general',
            'message' => 'Hello {{ trigger.model_data.name }}',
        ];
        
        $context = [
            'trigger' => [
                'model_data' => ['name' => 'John'],
            ],
        ];
        
        $result = $action->execute($settings, $context);
        
        $this->assertTrue($result['success']);
        $this->assertEquals('#general', $result['channel']);
    }
}
```

## Best Practices

### 1. Type Hints
```php
public function execute(array $settings, array $context): array
{
    // Return array
}
```

### 2. Dependency Injection
```php
public function execute(array $settings, array $context)
{
    $service = app(MyService::class);
    // Use service
}
```

### 3. Logging
```php
Log::info('Action executed', [
    'action' => static::type(),
    'settings' => $settings,
]);
```

### 4. Descriptive Schemas
```php
'description' => 'Supports variables like {{ trigger.model_data.field }}'
```

### 5. Validation
Always validate input before executing logic.

## Examples Repository

Check the built-in nodes for examples:
- `src/Actions/SendMailAction.php`
- `src/Conditions/EqualsCondition.php`
- `src/Triggers/ModelCreatedTrigger.php`

## Next Steps

- Review [Node Types](./node-types.md)
- Understand [Context Variables](./context-variables.md)
- Check [API Reference](./api-reference.md)
