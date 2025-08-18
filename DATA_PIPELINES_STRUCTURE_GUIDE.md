# Data Pipelines Structure Guide

## Overview
This guide documents the correct data structures and prop usage for data-pipeline pages to prevent recurring TypeScript errors.

## Component Interfaces

### 1. ImplementationChecklist

**Required Props:**
```typescript
interface ImplementationChecklistProps {
  title: string          // ✅ REQUIRED - Component title
  description: string    // ✅ REQUIRED - Component description  
  items: ChecklistItem[] // ✅ REQUIRED - Array of checklist items
}
```

**ChecklistItem Structure:**
```typescript
interface ChecklistItem {
  id: string
  title: string
  description: string
  category: "planning" | "implementation" | "testing" | "deployment" | "monitoring"
  priority: "low" | "medium" | "high" | "critical"
  estimatedTime?: string
  dependencies?: string[]
}
```

**Correct Usage:**
```typescript
<ImplementationChecklist 
  title="Pipeline Implementation Checklist"
  description="Follow this checklist for successful implementation"
  items={implementationChecklist}
/>
```

### 2. ToolComparison

**Required Props:**
```typescript
interface ToolComparisonProps {
  title: string           // ✅ REQUIRED - Component title
  description: string     // ✅ REQUIRED - Component description
  tools: ToolComparison[] // ✅ REQUIRED - Array of tools
  features: ToolFeature[] // ✅ REQUIRED - Array of features (can be empty)
}
```

**ToolComparison Structure:**
```typescript
interface ToolComparison {
  id: string
  name: string
  description: string
  category: string
  pricing: "free" | "freemium" | "paid" | "enterprise"
  features: string[]
  pros: string[]
  cons: string[]
  bestFor: string[]      // ✅ Must be string array, not string
  notFor: string[]       // ✅ Must be string array, not string
  rating: number
  marketShare: string
  learningCurve: "easy" | "medium" | "hard"  // ✅ Not "high"
  community: "small" | "medium" | "large"    // ✅ Not "good" or "excellent"
  documentation: "poor" | "fair" | "good" | "excellent"
}
```

**Correct Usage:**
```typescript
<ToolComparison 
  title="Technology Stack Comparison"
  description="Compare different ETL and orchestration tools"
  tools={tools}
  features={[]}  // Can be empty array if no specific features
/>
```

### 3. ArchitectureDiagram

**Required Props:**
```typescript
interface ArchitectureDiagramProps {
  title: string                    // ✅ REQUIRED - Component title
  description: string              // ✅ REQUIRED - Component description
  type: "decision-tree" | "flow-diagram" | "component-diagram"  // ✅ REQUIRED
  content: DecisionNode[] | string // ✅ REQUIRED - Decision nodes or string content
}
```

**DecisionNode Structure:**
```typescript
interface DecisionNode {
  id: string
  title: string        // ✅ REQUIRED - Node title
  description: string  // ✅ REQUIRED - Node description
  question: string     // ✅ REQUIRED - Decision question
  options: DecisionOption[]  // ✅ REQUIRED - Array of options
  icon?: React.ReactNode
}
```

**DecisionOption Structure:**
```typescript
interface DecisionOption {
  id: string           // ✅ REQUIRED - Option ID
  label: string        // ✅ REQUIRED - Option label (not "text")
  description: string  // ✅ REQUIRED - Option description
  nextNode?: string    // ✅ Optional - Next node ID
  outcome?: string     // ✅ Optional - Outcome description
  pros: string[]       // ✅ REQUIRED - Array of pros
  cons: string[]       // ✅ REQUIRED - Array of cons
  recommendation?: string  // ✅ Optional - Recommendation text
}
```

**Correct Usage:**
```typescript
<ArchitectureDiagram 
  title={decisionTree.title}
  description={decisionTree.description}
  type="decision-tree"
  content={decisionTree.nodes}  // ✅ Pass nodes array, not decisionTree object
/>
```

## Common Mistakes to Avoid

### ❌ Wrong ImplementationChecklist Usage
```typescript
// WRONG - Missing required props
<ImplementationChecklist items={implementationChecklist} />

// WRONG - Empty strings for required props
<ImplementationChecklist items={implementationChecklist} title={''} description={''} />
```

### ❌ Wrong ToolComparison Usage
```typescript
// WRONG - Missing required props
<ToolComparison tools={tools} />

// WRONG - Wrong data types
{
  bestFor: 'Simple ETL',        // ❌ Should be string[]
  notFor: 'Complex workflows',  // ❌ Should be string[]
  learningCurve: 'high',        // ❌ Should be "easy" | "medium" | "hard"
  community: 'good'             // ❌ Should be "small" | "medium" | "large"
}
```

### ❌ Wrong ArchitectureDiagram Usage
```typescript
// WRONG - Using decisionTree prop instead of correct props
<ArchitectureDiagram decisionTree={decisionTree} />

// WRONG - Missing required properties in DecisionNode
{
  id: 'start',
  question: 'What is your requirement?',  // ❌ Missing title and description
  options: [
    {
      text: 'Option 1',                   // ❌ Should be "label"
      nextNode: 'next',                   // ❌ Missing id, pros, cons
      description: 'Description'
    }
  ]
}
```

## Template for New Data Pipeline Pages

```typescript
export default function NewPipelinePage() {
  // 1. Implementation Checklist - Must have all required properties
  const implementationChecklist: ChecklistItem[] = [
    {
      id: '1',
      title: 'Planning Phase',
      description: 'Define requirements and architecture',
      category: 'planning' as const,      // ✅ Use "as const" for literal types
      priority: 'high' as const,          // ✅ Use "as const" for literal types
      estimatedTime: '2-3 days',
      dependencies: []
    }
  ]

  // 2. Decision Tree - Must follow DecisionNode interface exactly
  const decisionTree = {
    title: "Pipeline Architecture Decisions",
    description: "Choose the right architecture for your needs",
    nodes: [
      {
        id: 'start',
        title: 'Requirements Assessment',           // ✅ REQUIRED
        description: 'Assess your requirements',   // ✅ REQUIRED
        question: 'What is your primary need?',    // ✅ REQUIRED
        options: [
          {
            id: 'option-1',
            label: 'Real-time processing',         // ✅ REQUIRED (not "text")
            description: 'Choose for real-time needs',
            nextNode: 'real-time',
            pros: ['Low latency', 'Immediate insights'],  // ✅ REQUIRED
            cons: ['Higher complexity', 'More expensive'], // ✅ REQUIRED
            recommendation: 'Use for real-time requirements'
          }
        ]
      }
    ]
  }

  // 3. Tools - Must follow ToolComparison interface exactly
  const tools: ToolComparison[] = [
    {
      id: 'tool-1',
      name: 'Apache Kafka',
      description: 'Distributed streaming platform',
      category: 'streaming',
      pricing: 'free' as const,           // ✅ Use "as const" for literal types
      features: ['Streaming', 'Scalable'],
      pros: ['High throughput', 'Scalable'],
      cons: ['Complex setup', 'Learning curve'],
      bestFor: ['Real-time streaming'],   // ✅ Must be string array
      notFor: ['Simple batch processing'], // ✅ Must be string array
      rating: 4.8,
      marketShare: 'High',
      learningCurve: 'hard' as const,     // ✅ Use "as const" for literal types
      community: 'large' as const,        // ✅ Use "as const" for literal types
      documentation: 'excellent' as const // ✅ Use "as const" for literal types
    }
  ]

  return (
    <div>
      {/* Implementation Checklist */}
      <ImplementationChecklist 
        title="Pipeline Implementation Checklist"
        description="Follow this checklist for successful implementation"
        items={implementationChecklist}
      />

      {/* Architecture Decision Tree */}
      <ArchitectureDiagram 
        title={decisionTree.title}
        description={decisionTree.description}
        type="decision-tree"
        content={decisionTree.nodes}
      />

      {/* Tool Comparison */}
      <ToolComparison 
        title="Technology Stack Comparison"
        description="Compare different tools and technologies"
        tools={tools}
        features={[]}
      />
    </div>
  )
}
```

## Validation Checklist

Before committing a data pipeline page, ensure:

- [ ] `ImplementationChecklist` has `title`, `description`, and `items` props
- [ ] `ToolComparison` has `title`, `description`, `tools`, and `features` props
- [ ] `ArchitectureDiagram` has `title`, `description`, `type`, and `content` props
- [ ] All enum values use `as const` assertions
- [ ] `bestFor` and `notFor` are string arrays, not strings
- [ ] `learningCurve` uses "easy" | "medium" | "hard" (not "high")
- [ ] `community` uses "small" | "medium" | "large" (not "good" or "excellent")
- [ ] All `DecisionNode` objects have `title` and `description` properties
- [ ] All `DecisionOption` objects have `id`, `label`, `pros`, and `cons` properties

## Running TypeScript Checks

To validate your page structure:

```bash
# Check specific file
npx tsc --noEmit --skipLibCheck src/app/system-design/data-pipelines/your-page/page.tsx

# Check all data pipeline pages
npx tsc --noEmit --skipLibCheck src/app/system-design/data-pipelines/**/*.tsx
```

This guide should prevent the recurring TypeScript errors in data pipeline pages.
