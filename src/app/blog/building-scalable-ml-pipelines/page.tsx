"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag, Share2, Github, ExternalLink } from "lucide-react"

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
              Machine Learning
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              January 15, 2024
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              8 min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Building Scalable ML Pipelines with Apache Airflow
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Learn how to design and implement robust machine learning pipelines that can handle production workloads and scale with your data needs.
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
              In today's data-driven world, machine learning models need to be continuously trained, validated, and deployed. 
              This requires robust, scalable pipelines that can handle complex workflows, dependencies, and error handling. 
              Apache Airflow has emerged as the de facto standard for orchestrating these ML pipelines.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In this comprehensive guide, we'll explore how to build production-ready ML pipelines using Apache Airflow, 
              covering everything from basic DAGs to advanced monitoring and scaling strategies.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6">Why Apache Airflow for ML Pipelines?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Apache Airflow provides several key advantages for ML pipeline orchestration:
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>DAG-based workflows:</strong> Define complex dependencies and execution order
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Scalability:</strong> Handle thousands of tasks across multiple workers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Monitoring:</strong> Real-time visibility into pipeline execution and performance
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Error handling:</strong> Built-in retry mechanisms and failure recovery
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Extensibility:</strong> Rich ecosystem of operators and integrations
              </span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mb-6">Basic ML Pipeline Structure</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            A typical ML pipeline consists of several key stages. Let's look at a basic structure:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Pipeline Stages:</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Data Ingestion</h4>
                  <p className="text-sm text-muted-foreground">Extract data from various sources</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Data Preprocessing</h4>
                  <p className="text-sm text-muted-foreground">Clean, transform, and validate data</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Feature Engineering</h4>
                  <p className="text-sm text-muted-foreground">Create and select relevant features</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Model Training</h4>
                  <p className="text-sm text-muted-foreground">Train ML models with hyperparameter tuning</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold">Model Evaluation</h4>
                  <p className="text-sm text-muted-foreground">Assess model performance and validation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </div>
                <div>
                  <h4 className="font-semibold">Model Deployment</h4>
                  <p className="text-sm text-muted-foreground">Deploy models to production environment</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Implementation Example</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Let's implement a simple ML pipeline using Airflow. Here's a basic example:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Basic ML Pipeline DAG</h3>
            <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm">
{`from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

default_args = {
    'owner': 'humblebabs',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'ml_training_pipeline',
    default_args=default_args,
    description='A simple ML training pipeline',
    schedule_interval=timedelta(days=1),
    catchup=False
)

def extract_data():
    """Extract data from source"""
    # Simulate data extraction
    data = pd.DataFrame({
        'feature1': np.random.randn(1000),
        'feature2': np.random.randn(1000),
        'target': np.random.randint(0, 2, 1000)
    })
    data.to_csv('/tmp/extracted_data.csv', index=False)
    return '/tmp/extracted_data.csv'

def preprocess_data():
    """Preprocess the data"""
    data = pd.read_csv('/tmp/extracted_data.csv')
    # Add preprocessing steps here
    data.to_csv('/tmp/preprocessed_data.csv', index=False)
    return '/tmp/preprocessed_data.csv'

def train_model():
    """Train the ML model"""
    data = pd.read_csv('/tmp/preprocessed_data.csv')
    X = data[['feature1', 'feature2']]
    y = data['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    
    # Save model
    joblib.dump(model, '/tmp/model.pkl')
    return '/tmp/model.pkl'

def evaluate_model():
    """Evaluate model performance"""
    model = joblib.load('/tmp/model.pkl')
    data = pd.read_csv('/tmp/preprocessed_data.csv')
    X = data[['feature1', 'feature2']]
    y = data['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    score = model.score(X_test, y_test)
    print(f"Model accuracy: {score:.4f}")
    return score

# Define tasks
extract_task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_data,
    dag=dag
)

preprocess_task = PythonOperator(
    task_id='preprocess_data',
    python_callable=preprocess_data,
    dag=dag
)

train_task = PythonOperator(
    task_id='train_model',
    python_callable=train_model,
    dag=dag
)

evaluate_task = PythonOperator(
    task_id='evaluate_model',
    python_callable=evaluate_model,
    dag=dag
)

# Set task dependencies
extract_task >> preprocess_task >> train_task >> evaluate_task`}
            </pre>
          </div>

          <h2 className="text-3xl font-bold mb-6">Advanced Features</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            For production ML pipelines, consider implementing these advanced features:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Parallel Processing</h3>
              <p className="text-muted-foreground text-sm">
                Use Airflow's parallel execution capabilities to process multiple datasets or train multiple models simultaneously.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Dynamic Task Generation</h3>
              <p className="text-muted-foreground text-sm">
                Generate tasks dynamically based on data availability or configuration parameters.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Monitoring & Alerting</h3>
              <p className="text-muted-foreground text-sm">
                Set up comprehensive monitoring with metrics collection and alerting for pipeline failures.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Data Lineage</h3>
              <p className="text-muted-foreground text-sm">
                Track data flow through your pipeline for compliance and debugging purposes.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong className="text-foreground">Modular Design:</strong>
                <span className="text-muted-foreground"> Break down complex pipelines into smaller, reusable components</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong className="text-foreground">Error Handling:</strong>
                <span className="text-muted-foreground"> Implement proper retry logic and failure recovery mechanisms</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong className="text-foreground">Resource Management:</strong>
                <span className="text-muted-foreground"> Configure appropriate resource limits and scaling policies</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong className="text-foreground">Testing:</strong>
                <span className="text-muted-foreground"> Write comprehensive tests for each pipeline stage</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong className="text-foreground">Documentation:</strong>
                <span className="text-muted-foreground"> Maintain clear documentation for pipeline configuration and usage</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Apache Airflow provides a powerful foundation for building scalable ML pipelines. By following the patterns 
            and best practices outlined in this guide, you can create robust, maintainable pipelines that can handle 
            the complexities of production ML workflows.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Remember that successful ML pipeline implementation is an iterative process. Start simple, monitor performance, 
            and gradually add complexity as your needs evolve.
          </p>
        </motion.div>

        {/* Article Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground">ML</span>
            <span className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground">Airflow</span>
            <span className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground">Python</span>
            <span className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground">Data Engineering</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Share this article:</span>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <Link
              href="https://github.com/humblebabs/ml-pipeline-examples"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View Code Examples
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 