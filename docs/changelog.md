---
title: Changelog
---

# Changelog

All notable changes to WorkflowStudio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- (Future features will be listed here)

---

## [1.1.0] - 2025-11-30

### Added
- Manual workflow execution - Test workflows directly from the editor with a single click
- Execute button in workflow editor toolbar for quick testing
- Test data input modal for model triggers - Enter test data (email, name, etc.) when manually executing workflows with model triggers
- Automatic execution status polling to show real-time progress
- Support for manual execution of all trigger types (model events, scheduled, webhook)
- Default test data generation for model triggers to prevent validation errors
- Dynamic model field detection - Test data modal automatically fetches fillable fields from selected model
- Webhook triggers - Allow external services to trigger workflows via HTTP requests
- Webhook URL display in node settings panel with copy functionality
- Optional webhook secret validation for security
- Support for multiple HTTP methods (GET, POST, PUT, PATCH, DELETE) in webhook triggers
- Scheduled triggers - Automatically trigger workflows on a schedule using cron expressions or predefined intervals

### Changed
- Conditions now use `value1` and `value2` instead of `field` and `value` for flexible comparisons
- Consistent dot notation throughout (removed mixed <code>&#123;&#123; &#125;&#125;</code> syntax in conditions)
- Optimized database queries with eager loading to prevent N+1 issues
- Refactored registry classes to use AbstractRegistry base class
- Improved code clarity and structure across the codebase
- Updated condition documentation and parameter names for clarity

### Fixed
- N+1 query issues in WorkflowTrigger and WorkflowRunner
- API endpoints returning incorrect data (actions API returning conditions)
- Direct action-to-action loops now properly detected and prevented
- Nodes being deleted on each save - now properly recognizes existing nodes by UUID
- Schema validation not working for required fields with dynamic variables
- Validation errors for optional fields when not provided (e.g., "from" field in Send Email action)
- Email validation errors when using dynamic variables like <code>&#123;&#123; trigger.model_data.email &#125;&#125;</code>
- Fields with dynamic variables (<code>&#123;&#123; &#125;&#125;</code>) now skip all validation at save time (validated at runtime instead)

### Removed
- Default value feature - removed to prevent field editing conflicts. All fields now start empty and users must explicitly set values.

---

## [1.0.1] - 2025-11-30

### Added
- WorkflowStudio logo in navbar
- Updated favicon to use logo image
- Enhanced asset serving to support images from public directory
- Improved logo display with fallback SVG icon

### Changed
- Optimized asset serving for better performance
- Better error handling for missing assets

---

## [1.0.0] - 2025-11-30

### Added
- Visual workflow builder with drag-and-drop canvas editor powered by React Flow
- Model-based triggers (created, updated, deleted events)
- Built-in actions: Webhook, Send Email, Update Model, Dispatch Job, Delay
- Built-in conditions: Equals, Contains, Greater Than, Less Than
- Conditional branching with TRUE/FALSE paths
- Context variables support (trigger, previous, node data)
- Queue support for asynchronous workflow execution
- Execution tracking and logging
- Custom nodes support (triggers, actions, conditions)
- Loop detection to prevent infinite action-to-action cycles
- Dynamic value comparison in conditions
- Dot notation for accessing context data
- Workflow management interface (create, edit, list)
- Execution detail view with execution canvas and node execution status
- Authorization system with middleware and configuration options
- Database migrations and models using UUIDs for primary keys
- Asset management and Blade directives for frontend integration

### Technical Details
- PHP ^8.2
- Laravel ^12.0
- Livewire ^3.0
