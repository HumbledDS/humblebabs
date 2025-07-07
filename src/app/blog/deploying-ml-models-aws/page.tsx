"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag, Share2, Cloud, Cpu, Shield, Zap, Database, Server } from "lucide-react"

export default function BlogPost() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Cloud Computing
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              December 20, 2023
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              18 min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Deploying ML Models on AWS: A Complete Guide
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Step-by-step guide to deploying machine learning models on AWS using SageMaker and other cloud services.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">H</span>
              </div>
              <div>
                <p className="font-medium text-foreground">HumbleBabs</p>
                <p className="text-sm text-muted-foreground">Data Scientist & AI Engineer</p>
              </div>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Deploying machine learning models in production requires careful planning, robust infrastructure, 
              and continuous monitoring. AWS provides a comprehensive suite of services for ML model deployment, 
              from training to serving and monitoring.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This guide covers the complete process of deploying ML models on AWS, including model preparation, 
              infrastructure setup, deployment strategies, and production monitoring.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6">AWS ML Services Overview</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            AWS offers several services for ML model deployment:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Amazon SageMaker</h3>
              <p className="text-muted-foreground text-sm">
                Fully managed service for building, training, and deploying ML models at scale.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">EC2 Instances</h3>
              <p className="text-muted-foreground text-sm">
                Virtual servers for custom ML model deployment with full control.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lambda Functions</h3>
              <p className="text-muted-foreground text-sm">
                Serverless compute for lightweight ML inference with automatic scaling.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ECS/EKS</h3>
              <p className="text-muted-foreground text-sm">
                Container orchestration for deploying ML models in containers.
              </p>
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Model Preparation</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Before deployment, models need to be properly prepared and packaged:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Preparation Steps:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Model Serialization</h4>
                  <p className="text-sm text-muted-foreground">Save models in compatible formats (pickle, joblib, ONNX)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Dependency Management</h4>
                  <p className="text-sm text-muted-foreground">Create requirements.txt or conda environment</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Inference Code</h4>
                  <p className="text-sm text-muted-foreground">Write prediction functions and API endpoints</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Testing</h4>
                  <p className="text-sm text-muted-foreground">Validate model performance and API functionality</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">SageMaker Deployment</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            SageMaker provides the most streamlined approach for ML model deployment:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Model Packaging</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Package your model with inference code using SageMaker's containerization approach.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`# Example: SageMaker model packaging
import sagemaker
from sagemaker.pytorch import PyTorchModel

model = PyTorchModel(
    model_data='s3://bucket/model.tar.gz',
    role=role,
    entry_point='inference.py',
    source_dir='./code',
    framework_version='1.9.0'
)`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Endpoint Deployment</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Deploy models as RESTful endpoints with automatic scaling and load balancing.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`# Deploy model endpoint
predictor = model.deploy(
    initial_instance_count=1,
    instance_type='ml.m5.large',
    endpoint_name='my-model-endpoint'
)`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">A/B Testing</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Compare model versions by routing traffic between different endpoints.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`# Configure A/B testing
variant1 = {
    'VariantName': 'variant-1',
    'ModelName': 'model-v1',
    'InitialVariantWeight': 50
}
variant2 = {
    'VariantName': 'variant-2', 
    'ModelName': 'model-v2',
    'InitialVariantWeight': 50
}`}
                </pre>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Infrastructure as Code</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Use Infrastructure as Code for reproducible and scalable deployments:
          </p>

          <div className="bg-primary/5 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">AWS CDK Example:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>VPC Configuration:</strong> Set up networking with proper security groups
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>IAM Roles:</strong> Define least-privilege permissions for model access
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Auto Scaling:</strong> Configure scaling policies based on demand
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Monitoring:</strong> Set up CloudWatch alarms and dashboards
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Security Best Practices</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Security is crucial for production ML deployments:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Network Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use VPCs, security groups, and private subnets to isolate ML infrastructure. 
                Implement proper ingress and egress rules to control traffic flow.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Data Encryption</h3>
              <p className="text-muted-foreground leading-relaxed">
                Encrypt data at rest using AWS KMS and in transit using TLS. Ensure model artifacts 
                and training data are properly encrypted.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Access Control</h3>
              <p className="text-muted-foreground leading-relaxed">
                Implement least-privilege IAM policies. Use AWS Secrets Manager for sensitive 
                configuration and API keys.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Monitoring and Observability</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Comprehensive monitoring is essential for production ML systems:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Model Performance</h4>
                  <p className="text-sm text-muted-foreground">Monitor prediction accuracy and drift</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">System Metrics</h4>
                  <p className="text-sm text-muted-foreground">Track CPU, memory, and latency</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Business Metrics</h4>
                  <p className="text-sm text-muted-foreground">Monitor business impact and ROI</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Cost Optimization</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Optimize costs while maintaining performance:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Instance Selection:</strong> Choose appropriate instance types based on workload requirements
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Auto Scaling:</strong> Scale down during low-traffic periods to reduce costs
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Spot Instances:</strong> Use spot instances for non-critical workloads
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Reserved Instances:</strong> Purchase reserved instances for predictable workloads
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Deploying ML models on AWS requires careful consideration of infrastructure, security, 
            monitoring, and cost optimization. By following this comprehensive guide, you can build 
            robust, scalable, and secure ML systems in production.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Remember that ML model deployment is an iterative process. Start with simple deployments 
            and gradually add complexity as your requirements evolve. Always prioritize security, 
            monitoring, and cost optimization from the beginning.
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex items-center gap-4 mb-4">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["AWS", "SageMaker", "ML", "Deployment", "Cloud Computing", "DevOps"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 