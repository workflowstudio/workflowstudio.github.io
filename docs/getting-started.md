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

## Understanding the Interface

### Workflows List Page
- **Statistics Cards**: View total workflows, active, and inactive counts
- **Search & Filters**: Find workflows by name, description, or status
- **Workflows Table**: Professional table showing:
  - Workflow name and description
  - Active/Inactive toggle switch
  - Node count
  - Execution statistics (total, successful, failed)
  - Success rate with colored progress bar
  - Last execution status and time
  - Actions (Edit and Delete buttons)
- **Sorting**: Click column headers to sort by name or updated time

### Workflow Editor Page

#### Header Section
- **Back Button**: Return to workflows list
- **Title**: "Edit Workflow" or "Create Workflow"
- **Save Button**: Gradient indigo button with shadow effect

#### Settings Card
- **Workflow Name**: Required field for workflow identification
- **Status Toggle**: Professional toggle switch to activate/deactivate
- **Description**: Optional field to describe workflow purpose

#### Canvas Section
- **Visual Editor**: Dark-themed canvas for building workflows
- **Node Library** (Left Sidebar):
  - Browse available triggers, conditions, and actions
  - Drag nodes onto the canvas to use them
- **Canvas** (Center):
  - Drag nodes to position them
  - Click nodes to configure settings
  - Connect nodes to define workflow logic
  - Pan by dragging the background
  - Zoom with scroll wheel
- **Settings Panel** (Right Sidebar):
  - Appears when clicking a node
  - Configure node-specific settings
  - Delete nodes
- **Execution History Panel** (Slide-out):
  - Click "History" button (top right) to view execution history
  - View past executions with status, duration, and timestamps
  - "View Details" button to see full execution flow

### Execution Detail Page
- **Header**: Workflow name and execution ID with status badge
- **Statistics Cards**: 
  - Started At time
  - Completed At time
  - Duration in seconds
  - Current status with colored indicators
- **Error Messages**: Displayed prominently if execution failed
- **Execution Flow**: Visual canvas showing executed nodes with:
  - Status indicators (green for success, red for failure)
  - Execution times and durations
  - Node outputs and results

## Next Steps

- Learn about [Node Types](./node-types.md)
- Understand [Context Variables](./context-variables.md)
- Explore [Conditional Branching](./conditional-branching.md)
- Create [Custom Nodes](./custom-nodes.md)
