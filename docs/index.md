---
layout: home

hero:
  name: "WorkflowStudio"
  text: "Visual Workflow Automation"
  tagline: Build powerful, visual workflows for Laravel with an intuitive drag-and-drop canvas editor. Automate complex business processes without writing code.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/workflowstudio

features:
  - icon: 🎨
    title: Visual Workflow Builder
    details: Intuitive drag-and-drop interface powered by React Flow. Build complex workflows visually without writing a single line of code.
  
  - icon: 🔀
    title: Conditional Branching
    details: Create TRUE/FALSE paths for conditional logic. Build sophisticated decision trees that route workflows based on data conditions.
  
  - icon: ⚡
    title: Model Triggers
    details: Automatically trigger workflows on model events (created, updated, deleted). React to database changes instantly with zero configuration.
  
  - icon: 🚀
    title: Queue Support
    details: Execute workflows asynchronously using Laravel queues. Keep your application responsive and scalable.
  
  - icon: 📦
    title: Built-in Actions
    details: Send emails, webhooks, update models, and more. Extensible action system for custom needs with pre-built actions for common tasks.
  
  - icon: 🔧
    title: Fully Extensible
    details: Create custom triggers, actions, and conditions. Build exactly what you need and integrate with any service or API.
---

## Why WorkflowStudio?

WorkflowStudio brings enterprise-grade workflow automation to Laravel applications. Whether you're building user onboarding flows, automated notifications, data processing pipelines, or complex business logic, WorkflowStudio provides the tools you need.

### Key Benefits

<div class="benefits">

<div class="benefit">

#### 🚀 Fast Implementation
Get started in minutes. Install the package, configure your models, and start building workflows immediately. No complex setup required.

</div>

<div class="benefit">

#### 🎨 Visual Editor
See your workflows as you build them. The visual canvas makes it easy to understand complex automation logic at a glance.

</div>

<div class="benefit">

#### 🔒 Production Ready
Built for Laravel with queue support, error handling, and comprehensive logging. Trusted by developers building mission-critical applications.

</div>

<div class="benefit">

#### 📊 Execution Tracking
Monitor workflow executions in real-time. View execution history, debug failures, and track performance metrics.

</div>

</div>

## Quick Start

Get up and running in just a few commands:

```bash
# Install the package
composer require workflowstudio/workflowstudio

# Publish configuration and assets
php artisan vendor:publish --provider="WorkflowStudio\WorkflowStudioServiceProvider"

# Run migrations
php artisan migrate
```

That's it! Visit `/workflowstudio/workflows` to start building your first workflow.

## Visual Example

See WorkflowStudio in action with our intuitive drag-and-drop interface:

<div class="example-section">

![WorkflowStudio Visual Workflow Builder](./hero-section.png)

</div>

## Use Cases

### 👥 User Onboarding
Automate welcome emails, profile setup, and account activation workflows when new users register.

### 🛒 E-commerce Automation
Trigger order confirmations, inventory updates, shipping notifications, and customer follow-ups.

### 📊 Data Processing
Process uploaded files, transform data, sync with external services, and generate reports automatically.

### 🔔 Notification Systems
Send alerts, reminders, and updates based on system events, user actions, or scheduled triggers.

### 🔌 Integration Workflows
Connect with third-party APIs, webhooks, and services without writing custom integration code.

<style>
.benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.benefit {
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}

.benefit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.benefit h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
}

.benefit p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.use-cases {
  margin: 2rem 0;
}

.use-cases h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  font-size: 1.2rem;
}

.use-cases p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--vp-c-brand);
}

.cta-wrapper {
  text-align: center;
  margin: 3rem 0;
  padding: 2rem 0;
}

.cta-text {
  margin: 0 0 1.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}

.cta-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-links a {
  display: inline-block;
  padding: 0.625rem 1.5rem;
  background: var(--vp-c-brand-3);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s ease;
}

.cta-links a:hover {
  background: var(--vp-c-brand-2);
}

.cta-links a:last-child {
  background: transparent;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.cta-links a:last-child:hover {
  border-color: var(--vp-c-brand-3);
  color: var(--vp-c-brand-3);
  background: var(--vp-c-bg-soft);
}

.example-section {
  margin: 3rem auto;
  max-width: 1200px;
  text-align: center;
  padding: 0;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.example-section img {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  border-radius: 0;
  box-shadow: none;
  transition: transform 0.3s ease;
}

.example-section img:hover {
  transform: scale(1.01);
}
</style>
