---
title: Getting Started with WorkflowStudio
---

This guide will help you create your first workflow using WorkflowStudio.

## Prerequisites

- Laravel 11.x or higher
- PHP 8.2 or higher
- Node.js 18+ (for asset compilation)

## Installation

1. **Install the package:**
   ```bash
   composer require workflowstudio/workflowstudio
   ```

2. **Publish configuration and assets:**
   ```bash
   php artisan vendor:publish --provider="WorkflowStudio\WorkflowStudioServiceProvider"
   ```

3. **Run migrations:**
   ```bash
   php artisan migrate
   ```

4. **Configure observed models** in `config/workflowstudio.php`:
   ```php
   'observed_models' => [
       \App\Models\User::class,
       \App\Models\Post::class,
   ],
   ```

5. **Start queue worker:**
   ```bash
   php artisan queue:work
   ```

## Creating Your First Workflow

### Step 1: Access the Workflow Builder

Navigate to `http://your-app.test/workflowstudio/workflows` in your browser.

### Step 2: Create a New Workflow

1. Click the "Create Workflow" button
2. Fill in the workflow details:
   - **Name**: "Welcome New Users"
   - **Description**: "Send welcome email to new users"
   - **Active**: Toggle on

### Step 3: Build Your Workflow

1. **Add a Trigger Node**
   - Drag "Model Created" from the node library
   - Click on the node to configure:
     - Select `App\Models\User` from the model dropdown
   
2. **Add a Condition Node** (Optional)
   - Drag "Equals" condition from the library
   - Configure:
     - Field: <code>trigger.model_data.name</code>
     - Value: `John`

3. **Add Action Nodes**
   - Drag "Send Email" action from the library
   - Configure for TRUE branch:
     - To: <code>&#123;&#123; trigger.model_data.email &#125;&#125;</code>
     - Subject: <code>Welcome &#123;&#123; trigger.model_data.name &#125;&#125;!</code>
     - Body: <code>Hi &#123;&#123; trigger.model_data.name &#125;&#125;, welcome to our platform!</code>
   
   - Add another "Send Email" for FALSE branch:
     - To: `admin@example.com`
     - Subject: `New user registered`
     - Body: <code>User &#123;&#123; trigger.model_data.name &#125;&#125; just signed up!</code>

### Step 4: Connect Nodes

1. Click and drag from the trigger node's output to the condition node
2. Connect the condition node to both email actions
3. Right-click each edge from the condition:
   - Set first edge to "True Branch"
   - Set second edge to "False Branch"

### Step 5: Save and Test

1. Click the "Save Workflow" button
2. Create a test user to trigger the workflow:
   ```php
   User::create([
       'name' => 'John',
       'email' => 'john@example.com',
       'password' => bcrypt('password'),
   ]);
   ```

3. Check your queue logs to see the workflow execution

## Next Steps

- Learn about [Triggers](./triggers.md)
- Explore [Actions](./actions.md)
- Understand [Context Variables](./context-variables.md)
- Create [Custom Nodes](./custom-nodes.md)
