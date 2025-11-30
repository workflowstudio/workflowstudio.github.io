---
title: Getting Started with WorkflowStudio
---

This guide will help you create your first workflow using WorkflowStudio.

## Prerequisites

- Laravel 11.x or higher
- PHP 8.2 or higher
- Node.js 18+ (for asset compilation)
- A valid WorkflowStudio license

## Distribution

WorkflowStudio is distributed as a **PHP package** via a private Composer registry. The package uses **Composer** as the updater.

### Requirements

In order to install WorkflowStudio, you must have:
- A valid `composer.json` file in your project root
- A valid WorkflowStudio license key
- The email address associated with your license

## Installation

### Step 1: Add Private Composer Registry

WorkflowStudio is distributed through a private Composer registry. Add the repository to your `composer.json`:

```json
{
  "repositories": [
    {
      "type": "composer",
      "url": "https://workflowstudio.composer.sh"
    }
  ]
}
```

### Step 2: Install the Package

Install WorkflowStudio using Composer:

```bash
composer require workflowstudio/workflowstudio
```

### Step 3: Authenticate

When prompted for authentication, enter your license credentials:

```
Loading composer repositories with package information
Authentication required (workflowstudio.composer.sh):
Username: [your-email@example.com]
Password: [your-license-key]
```

**Authentication Details:**
- **Username**: Your email address (the one associated with your license)
  - If your license is not assigned to a licensee, you can enter `unlock` as the username instead
- **Password**: Your license key

> **Note**: Fingerprint authentication is currently **disabled**. If fingerprint authentication is enabled in the future, you would append it to your license key separated by a colon (`:`), like: `license-key:fingerprint`

**Example Authentication:**
```
Loading composer repositories with package information
Authentication required (workflowstudio.composer.sh):
Username: user@example.com
Password: 8c21df8f-6273-4932-b4ba-8bcc723ef500
```

### Step 4: Publish Configuration and Assets

Publish the configuration and assets:

```bash
php artisan vendor:publish --provider="WorkflowStudio\WorkflowStudioServiceProvider"
```

### Step 5: Run Migrations

Run the database migrations:

```bash
php artisan migrate
```

### Step 6: Configure Observed Models

Configure which models to observe in `config/workflowstudio.php`:

```php
'observed_models' => [
    \App\Models\User::class,
    \App\Models\Post::class,
    // Add more models as needed
],
```

### Step 7: Start Queue Worker

Workflows run asynchronously, so start the queue worker:

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
