---
title: Conditions
---

Conditions evaluate expressions and control workflow branching through TRUE/FALSE paths.

## Available Conditions

### Equals

Checks if two values are equal (case-sensitive string comparison).

**Type:** `equals`

**Settings:**
```yaml
value1: trigger.model_data.status
value2: active
```

**Returns:**
- `true` if values are equal
- `false` if values are different

**Examples:**
```yaml
# Check user role
value1: trigger.model_data.role
value2: admin

# Check status
value1: trigger.model_data.is_active
value2: 1

# Check previous action result
value1: previous.success
value2: true

# Compare two dynamic values
value1: previous.amount
value2: trigger.model_data.threshold
```

### Contains

Checks if a string contains a substring (case-sensitive).

**Type:** `contains`

**Settings:**
```yaml
value1: trigger.model_data.email
value2: @company.com
```

**Returns:**
- `true` if value1 contains value2
- `false` if not found

**Examples:**
```yaml
# Email domain check
value1: trigger.model_data.email
value2: @company.com

# Text content check
value1: trigger.model_data.bio
value2: developer

# Tag check
value1: trigger.model_data.tags
value2: premium

# Check if previous result contains text
value1: previous.message
value2: success
```

### Greater Than

Numeric comparison (>).

**Type:** `greater_than`

**Settings:**
```yaml
value1: trigger.model_data.age
value2: 18
```

**Returns:**
- `true` if value1 > value2
- `false` otherwise

**Examples:**
```yaml
# Age verification
value1: trigger.model_data.age
value2: 18

# Price check
value1: trigger.model_data.price
value2: 100

# Compare previous amount with threshold
value1: previous.amount
value2: trigger.model_data.threshold
```

### Less Than

Numeric comparison (<).

**Type:** `less_than`

**Settings:**
```yaml
value1: trigger.model_data.price
value2: 100
```

**Returns:**
- `true` if value1 < value2
- `false` otherwise

**Examples:**
```yaml
# Low stock alert
value1: trigger.model_data.stock
value2: 10

# Budget check
value1: trigger.model_data.amount
value2: 1000

# Compare previous count with limit
value1: previous.count
value2: trigger.model_data.limit
```

## Using Context Variables

Conditions can access any context variable:

### From Trigger
```yaml
value1: trigger.model_data.status
value2: active

value1: trigger.model_id
value2: 123

value1: trigger.event
value2: created
```

### From Previous Nodes
```yaml
value1: previous.success
value2: true

value1: previous.status
value2: completed

value1: previous.amount
value2: trigger.model_data.threshold
```

### Nested Access
```yaml
value1: trigger.model_data.profile.verified
value2: true

value1: trigger.model_data.settings.notifications
value2: enabled

value1: previous.response.data.success
value2: true
```

## Branching

Conditions support TRUE/FALSE branching:

```
Condition
    ↓ TRUE → Action A
    ↓ FALSE → Action B
```

Right-click on edges to set branch type.

## Workflow Examples

### Example 1: User Verification

```
Trigger: User Created
    ↓
Condition: Email contains "@company.com"
    ↓ TRUE                    ↓ FALSE
Send Employee Welcome     Send Guest Welcome
    ↓
Grant Admin Access
```

### Example 2: Order Processing

```
Trigger: Order Created
    ↓
Condition: Amount > 1000
    ↓ TRUE                    ↓ FALSE
Flag for Review           Auto-Process
    ↓                         ↓
Send Admin Alert          Send Confirmation
```

### Example 3: Content Moderation

```
Trigger: Comment Created
    ↓
Condition: Contains "spam"
    ↓ TRUE                    ↓ FALSE
Delete Comment            Approve Comment
    ↓                         ↓
Ban User                  Notify Author
```

### Example 4: Nested Conditions

```
Trigger: User Updated
    ↓
Condition: Role equals "admin"
    ↓ TRUE                    ↓ FALSE
Condition: Active = true  Do Nothing
    ↓ TRUE      ↓ FALSE
Grant Access   Revoke Access
```

## Multiple Conditions (AND/OR Logic)

### AND Logic (Sequential)

Execute actions only if ALL conditions are true:

```
Condition A (Age > 18)
    ↓ TRUE
Condition B (Verified = true)
    ↓ TRUE
Action: Grant Access
```

### OR Logic (Parallel)

Execute action if ANY condition is true:

```
Condition A (Role = admin)
    ↓ TRUE → Grant Access
    
Condition B (Verified = true)
    ↓ TRUE → Grant Access
```

## Value Resolution

Values are resolved from context at runtime using dot notation:

```yaml
# Dot notation path
value1: trigger.model_data.status

# Resolves to:
$context['trigger']['model_data']['status']
```

**Resolution Process:**
1. Check if value starts with `trigger.`, `previous.`, or `node.`
2. If yes, split by dots and navigate context
3. If no, treat as plain value (string, number, etc.)
4. Return resolved value or null if path not found

## Value Types

Both `value1` and `value2` support:

### Plain Values
```yaml
value1: active
value2: active

value1: 18
value2: 20

value1: true
value2: true
```

### Dot Notation Paths
```yaml
value1: trigger.model_data.status
value2: previous.status

value1: previous.amount
value2: trigger.model_data.threshold
```

**Note:** Equals condition performs loose comparison (`==`), so types are converted as needed.

## Debugging Conditions

### Log Context Values

Add a debug email action before condition:

```yaml
To: debug@example.com
Body: |
  Field value: {{ trigger.model_data.status }}
  Expected: active
```

### Check Workflow Logs

```bash
tail -f storage/logs/laravel.log | grep "Condition"
```

### Test in Tinker

```php
use WorkflowStudio\Services\ConditionEvaluator;

$evaluator = app(ConditionEvaluator::class);

$result = $evaluator->evaluate('equals', [
    'value1' => 'trigger.model_data.status',
    'value2' => 'active'
], [
    'trigger' => [
        'model_data' => ['status' => 'active']
    ]
]);

// Returns: true
```

## Common Patterns

### Email Domain Check
```yaml
Condition: Contains
value1: trigger.model_data.email
value2: @company.com
```

### Age Verification
```yaml
Condition: Greater Than
value1: trigger.model_data.age
value2: 18
```

### Status Check
```yaml
Condition: Equals
value1: trigger.model_data.status
value2: active
```

### Action Result Check
```yaml
Condition: Equals
value1: previous.success
value2: true
```

### Compare Two Dynamic Values
```yaml
Condition: Greater Than
value1: previous.amount
value2: trigger.model_data.threshold
```

### Low Stock Alert
```yaml
Condition: Less Than
value1: trigger.model_data.stock
value2: 10
```

## Best Practices

### 1. Use Descriptive Values

```yaml
✅ Good
value1: trigger.model_data.subscription_status
value2: active

❌ Bad
value1: trigger.model_data.s
value2: 1
```

### 2. Handle Missing Fields

Conditions return `false` if a path doesn't exist:

```yaml
value1: trigger.model_data.optional_field
value2: expected_value
# Returns false if optional_field doesn't exist
```

### 3. Label Branches Clearly

Right-click edges to set TRUE/FALSE labels for clarity.

### 4. Test Edge Cases

Test with:
- Null values
- Empty strings
- Zero values
- Missing fields

### 5. Use Appropriate Condition Types

```yaml
✅ Use Contains for substring matching
value1: trigger.model_data.email
value2: @company.com

❌ Don't use Equals for substring
value1: trigger.model_data.email
value2: @company.com  # Won't match full email
```

## Creating Custom Conditions

See [Creating Custom Nodes](./custom-nodes.md#creating-a-custom-condition) for how to create custom condition types.

Example custom condition:

```php
class IsWeekdayCondition extends AbstractCondition
{
    public function evaluate(array $settings, array $context): bool
    {
        return !now()->isWeekend();
    }
}
```

## Limitations

- No complex expressions (e.g., `value1 AND value2`)
- No mathematical operations (e.g., `value1 + 10`)
- Case-sensitive comparisons
- Loose comparison for equals (uses `==`)

For complex logic, chain multiple conditions or create custom conditions.

## Next Steps

- Explore [Actions](./actions.md)
- Understand [Context Variables](./context-variables.md)
- Create [Custom Conditions](./custom-nodes.md)
