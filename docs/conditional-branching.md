---
title: Conditional Branching
---

Conditional branching allows workflows to take different paths based on condition results. This enables TRUE/FALSE logic flows.

## Overview

When a condition node evaluates:
- **TRUE**: Executes connections marked as "True Branch"
- **FALSE**: Executes connections marked as "False Branch"

This allows you to create sophisticated workflows with decision-making logic.

## Setting Up Branches

### Step 1: Add a Condition Node

Drag a condition node (e.g., "Equals") onto the canvas and configure it:

```yaml
Field: trigger.model_data.status
Value: active
```

### Step 2: Connect to Multiple Actions

Connect the condition node to two different action nodes:
- One for the TRUE case
- One for the FALSE case

### Step 3: Set Branch Types

1. **Right-click on the first edge** (connection line)
2. Select **"True Branch"** from the context menu
   - The edge turns **green** with a "TRUE" label

3. **Right-click on the second edge**
4. Select **"False Branch"** from the context menu
   - The edge turns **red** with a "FALSE" label

### Step 4: Save and Test

Click "Save Workflow" to persist the branch types.

## Visual Indicators

### Edge Colors
- **Green edge**: TRUE branch (executes when condition passes)
- **Red edge**: FALSE branch (executes when condition fails)
- **Gray edge**: No branch type (default, executes always)

### Edge Labels
- **TRUE**: Visible on green edges
- **FALSE**: Visible on red edges

## Example Workflows

### Example 1: User Validation

```
Trigger: User Created
    ↓
Condition: Email contains "@company.com"
    ↓ TRUE                           ↓ FALSE
Send Email:                      Send Email:
"Welcome team member!"           "Welcome guest user!"
To: {{ trigger.model_data.email }}
```

### Example 2: Price-Based Actions

```
Trigger: Order Created
    ↓
Condition: Amount > 100
    ↓ TRUE                           ↓ FALSE
Send Email:                      Send Email:
"Thank you for your large order" "Thank you for your order"
    ↓
Webhook: Notify fulfillment
```

### Example 3: Nested Conditions

```
Trigger: User Updated
    ↓
Condition: Role equals "admin"
    ↓ TRUE                           ↓ FALSE
Condition: Active equals true        Update Model
    ↓ TRUE          ↓ FALSE
Send Notification   Disable Access
```

## Branch Configuration

### Right-Click Context Menu

When you right-click on an edge from a condition node, you see:

```
┌─────────────────────────┐
│  Set Branch Type        │
├─────────────────────────┤
│ ● True Branch           │ → Green edge
│ ● False Branch          │ → Red edge
│ ● Default (No Type)     │ → Gray edge
└─────────────────────────┘
```

### Branch Types

| Type | When Executes | Color | Use Case |
|------|---------------|-------|----------|
| **true** | Condition returns `true` | Green | Success path |
| **false** | Condition returns `false` | Red | Failure path |
| **null** | Always (backward compatible) | Gray | Non-condition nodes |

## Best Practices

### 1. Always Set Both Branches

```
✅ GOOD: TRUE and FALSE branches both configured
Condition
  ↓ TRUE → Action A
  ↓ FALSE → Action B

❌ BAD: Only TRUE branch configured
Condition
  ↓ TRUE → Action A
  (FALSE path goes nowhere)
```

### 2. Visual Organization

Position TRUE branches on top/left and FALSE branches on bottom/right:

```
Condition
    ↑
  TRUE
    ↓
  [Success Actions]

    ↓
  FALSE
    ↓
  [Failure Actions]
```

### 3. Clear Naming

Use descriptive action names that indicate branch purpose:

```
✅ "Send Success Email"
✅ "Notify Admin of Failure"
❌ "Send Email"
❌ "Action 1"
```

### 4. Document Complex Logic

For multiple conditions, add notes in the workflow description:

```
TRUE → User is active admin
FALSE → User is inactive or not admin
```

## Multiple Conditions

You can chain multiple conditions for complex logic:

### AND Logic (Sequential)
```
Condition A
    ↓ TRUE
  Condition B
      ↓ TRUE
    Action
```
Both A AND B must be true.

### OR Logic (Parallel)
```
Condition A
    ↓ TRUE → Action
    
Condition B
    ↓ TRUE → Action
```
Either A OR B triggers the action.

## Edge Cases

### No Branch Type Set

If you don't set a branch type on an edge from a condition node:
- It defaults to TRUE branch behavior (backward compatibility)
- Best practice: Always explicitly set branch types

### Multiple TRUE/FALSE Branches

You can have multiple edges of the same type:

```
Condition
    ↓ TRUE → Action A
    ↓ TRUE → Action B
    ↓ FALSE → Action C
```

Both Action A and B execute when condition is true.

### Condition with No Connections

If a condition has no outgoing connections:
- The workflow stops at that condition
- No error is thrown

## Technical Details

### Database Storage

Branch types are stored in the `node_connections` table:

```php
branch_type: 'true' | 'false' | null
```

### Workflow Execution

The `WorkflowRunner` checks branch types:

```php
if ($nodeOutput === true && $branchType === 'true') {
    // Execute TRUE branch
}
if ($nodeOutput === false && $branchType === 'false') {
    // Execute FALSE branch
}
```

### Frontend Implementation

- **CustomEdge**: Renders colored edges with labels
- **EdgeContextMenu**: Right-click menu for setting types
- **FlowCanvas**: Handles edge context menu (condition nodes only)

## Troubleshooting

### Both branches executing?

**Cause**: Branch types not set or not saved properly.

**Solution**:
1. Right-click each edge and set branch type
2. Click "Save Workflow"
3. Refresh the page and verify colors

### Context menu not appearing?

**Cause**: Right-clicking edge from non-condition node.

**Solution**: Context menu only appears on edges from condition nodes.

### Edge color not showing?

**Cause**: Assets not published or browser cache.

**Solution**:
```bash
php artisan vendor:publish --tag=workflowstudio-assets --force
```
Clear browser cache.

## Advanced Patterns

### Error Handling Pattern

```
Action (risky operation)
    ↓
Condition: previous.success equals true
    ↓ TRUE                    ↓ FALSE
Continue workflow          Send error notification
```

### Retry Logic Pattern

```
Action (API call)
    ↓
Condition: previous.status equals 200
    ↓ TRUE                    ↓ FALSE
Success action            Retry action → loops back
```

### Multi-Path Decision

```
Condition: Status
    ↓ TRUE (active) → Enable features
    ↓ FALSE (inactive) → Disable features
         ↓
      Condition: Role
         ↓ TRUE (admin) → Grant admin access
         ↓ FALSE → Grant user access
```

## Next Steps

- Learn about [Conditions](./conditions.md)
- Understand [Context Variables](./context-variables.md)
- Create [Custom Conditions](./custom-nodes.md#custom-conditions)
