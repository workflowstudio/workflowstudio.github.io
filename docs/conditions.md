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
field: trigger.model_data.status
value: active
```

**Returns:**
- `true` if values are equal
- `false` if values are different

**Examples:**
```yaml
field: trigger.model_data.role
value: admin

# Check status
field: trigger.model_data.is_active
value: 1

# Check previous action result
field: previous.success
value: true
```

### Contains

Checks if a string contains a substring (case-sensitive).

**Type:** `contains`

**Settings:**
```yaml
field: trigger.model_data.email
value: @company.com
```

**Returns:**
- `true` if the field contains the value
- `false` if not found

**Examples:**
```yaml
# Email domain check
field: trigger.model_data.email
value: @company.com

# Text content check
field: trigger.model_data.bio
value: developer

# Tag check
field: trigger.model_data.tags
value: premium
```

### Greater Than

Numeric comparison (>).

**Type:** `greater_than`

**Settings:**
```yaml
field: trigger.model_data.age
value: 18
```

**Returns:**
- `true` if field > value
- `false` otherwise

**Examples:**
```yaml
# Age verification
field: trigger.model_data.age
value: 18

# Price check
field: trigger.model_data.price
value: 100

# Quantity check
field: trigger.model_data.quantity
value: 0
```

### Less Than

Numeric comparison (<).

**Type:** `less_than`

**Settings:**
```yaml
field: trigger.model_data.price
value: 100
```

**Returns:**
- `true` if field < value
- `false` otherwise

**Examples:**
```yaml
# Low stock alert
field: trigger.model_data.stock
value: 10

# Budget check
field: trigger.model_data.amount
value: 1000

# Rating filter
field: trigger.model_data.rating
value: 3
```

## Using Context Variables

Conditions can access any context variable:

### From Trigger
```yaml
field: trigger.model_data.status
field: trigger.model_id
field: trigger.event
```

### From Previous Nodes
```yaml
field: previous.success
field: previous.status
field: node.123.result
```

### Nested Access
```yaml
field: trigger.model_data.profile.verified
field: trigger.model_data.settings.notifications
field: previous.response.data.success
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

## Field Resolution

Fields are resolved from context at runtime:

```yaml
# Static field path
field: trigger.model_data.status

# Resolves to:
$context['trigger']['model_data']['status']
```

**Resolution Process:**
1. Split field by dots: `['trigger', 'model_data', 'status']`
2. Navigate context: `$context['trigger']['model_data']['status']`
3. Return value or null

## Value Types

### Strings
```yaml
value: active
value: "@company.com"
value: "true"  # String, not boolean
```

### Numbers
```yaml
value: 18
value: 100.50
value: 0
```

### Booleans
```yaml
value: true
value: false
```

**Note:** Equals condition performs string comparison, so `true` is compared as string `"true"`.

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
    'field' => 'trigger.model_data.status',
    'value' => 'active'
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
field: trigger.model_data.email
value: @company.com
```

### Age Verification
```yaml
Condition: Greater Than
field: trigger.model_data.age
value: 18
```

### Status Check
```yaml
Condition: Equals
field: trigger.model_data.status
value: active
```

### Action Result Check
```yaml
Condition: Equals
field: previous.success
value: true
```

### Low Stock Alert
```yaml
Condition: Less Than
field: trigger.model_data.stock
value: 10
```

## Best Practices

### 1. Use Descriptive Values

```yaml
✅ Good
field: trigger.model_data.subscription_status
value: active

❌ Bad
field: trigger.model_data.s
value: 1
```

### 2. Handle Missing Fields

Conditions return `false` if field doesn't exist:

```yaml
field: trigger.model_data.optional_field
# Returns false if field doesn't exist
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
field: trigger.model_data.email
Condition: Contains
value: @company.com

❌ Don't use Equals for substring
field: trigger.model_data.email
Condition: Equals
value: @company.com  # Won't match full email
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

- No complex expressions (e.g., `field1 AND field2`)
- No mathematical operations (e.g., `field + 10`)
- Case-sensitive comparisons
- String-based equals comparison

For complex logic, chain multiple conditions or create custom conditions.

## Next Steps

- Explore [Actions](./actions.md)
- Understand [Context Variables](./context-variables.md)
- Create [Custom Conditions](./custom-nodes.md)
