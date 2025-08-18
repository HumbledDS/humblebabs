import { Metadata } from 'next'
import { TutorialSection } from '@/components/projects/tutorial-section'
import { ImplementationChecklist } from '@/components/projects/implementation-checklist'
import { ArchitectureDiagram } from '@/components/projects/architecture-diagram'
import { ToolComparison } from '@/components/projects/tool-comparison'
import { 
  Database, 
  RefreshCw, 
  FileText, 
  BarChart3, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Workflow
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'ETL Batch Pipeline - System Design',
  description: 'Comprehensive guide to building robust ETL batch processing pipelines for data warehousing and analytics.',
}

export default function ETLBatchPipelinePage() {
  const tutorialSteps = [
    {
      title: "ETL Data Architecture",
      description: "Design a comprehensive data architecture for batch ETL processing with proper staging and data quality.",
      icon: Database,
      content: `
        ## ETL Batch Processing Architecture
        
        ### Data Flow Stages
        1. **Extract**: Source systems, file systems, APIs, databases
        2. **Transform**: Data cleansing, validation, enrichment, aggregation
        3. **Load**: Target data warehouse, data marts, operational stores
        
        ### Staging Area Design
        - **Raw Zone**: Unprocessed data from source systems
        - **Staging Zone**: Cleaned and validated data
        - **Processed Zone**: Transformed and aggregated data
        - **Archive Zone**: Historical data for compliance
        
        ### Data Quality Framework
        - **Validation Rules**: Data type, range, format, business rules
        - **Quality Metrics**: Completeness, accuracy, consistency, timeliness
        - **Error Handling**: Rejection, correction, notification strategies
        - **Monitoring**: Quality dashboards and alerting
        
        ### Key Design Principles
        - **Idempotency**: Multiple runs produce same result
        - **Fault Tolerance**: Graceful handling of failures
        - **Scalability**: Horizontal scaling for large datasets
        - **Maintainability**: Clear separation of concerns
      `,
      codeBlock: {
        language: 'sql',
        code: `-- ETL Staging Area Schema
CREATE SCHEMA staging;
CREATE SCHEMA processed;
CREATE SCHEMA archive;

-- Raw data staging table
CREATE TABLE staging.raw_customer_data (
    id BIGSERIAL PRIMARY KEY,
    source_file VARCHAR(255),
    source_timestamp TIMESTAMPTZ,
    raw_data JSONB,
    processing_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cleaned customer data
CREATE TABLE staging.clean_customer_data (
    customer_id BIGINT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    validation_status VARCHAR(20),
    validation_errors TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data quality monitoring
CREATE TABLE staging.data_quality_checks (
    check_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(255),
    check_type VARCHAR(100),
    check_sql TEXT,
    expected_result TEXT,
    actual_result TEXT,
    status VARCHAR(20),
    run_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ETL job tracking
CREATE TABLE staging.etl_jobs (
    job_id BIGSERIAL PRIMARY KEY,
    job_name VARCHAR(255),
    source_system VARCHAR(100),
    target_system VARCHAR(100),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    status VARCHAR(20),
    records_processed BIGINT,
    records_failed BIGINT,
    error_message TEXT
);

-- Create indexes for performance
CREATE INDEX idx_raw_data_status ON staging.raw_customer_data(processing_status);
CREATE INDEX idx_clean_data_validation ON staging.clean_customer_data(validation_status);
CREATE INDEX idx_etl_jobs_status ON staging.etl_jobs(status, start_time);`
      }
    },
    {
      title: "Data Transformation Pipeline",
      description: "Implement robust data transformation logic with error handling and data quality checks.",
      icon: RefreshCw,
      content: `
        ## Data Transformation Strategies
        
        ### Data Cleansing
        - **Standardization**: Consistent formats, units, and naming
        - **Deduplication**: Remove duplicate records
        - **Validation**: Business rule enforcement
        - **Enrichment**: Add derived fields and external data
        
        ### Transformation Types
        - **Simple Transformations**: Data type conversion, formatting
        - **Complex Transformations**: Business logic, calculations
        - **Aggregations**: Summarization and grouping
        - **Joins**: Data integration from multiple sources
        
        ### Error Handling Strategies
        - **Reject and Continue**: Skip invalid records, log errors
        - **Default Values**: Use fallback values for missing data
        - **Data Correction**: Apply business rules to fix issues
        - **Manual Review**: Flag records for human intervention
        
        ### Performance Optimization
        - **Partitioning**: Process data in parallel chunks
        - **Caching**: Store frequently accessed lookup data
        - **Indexing**: Optimize database queries
        - **Resource Management**: Control memory and CPU usage
      `,
      codeBlock: {
        language: 'python',
        code: `# ETL Data Transformation Pipeline
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import logging
from datetime import datetime, timedelta

class ETLTransformer:
    def __init__(self, config: Dict):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.validation_rules = self._load_validation_rules()
        
    def transform_customer_data(self, raw_data: pd.DataFrame) -> Tuple[pd.DataFrame, List[Dict]]:
        """Transform raw customer data with comprehensive error handling"""
        errors = []
        transformed_data = raw_data.copy()
        
        try:
            # Step 1: Data type conversion and standardization
            transformed_data = self._standardize_data_types(transformed_data)
            
            # Step 2: Data cleansing
            transformed_data, cleansing_errors = self._cleanse_data(transformed_data)
            errors.extend(cleansing_errors)
            
            # Step 3: Data validation
            transformed_data, validation_errors = self._validate_data(transformed_data)
            errors.extend(validation_errors)
            
            # Step 4: Data enrichment
            transformed_data = self._enrich_data(transformed_data)
            
            # Step 5: Deduplication
            transformed_data = self._deduplicate_data(transformed_data)
            
            # Step 6: Final formatting
            transformed_data = self._format_final_data(transformed_data)
            
        except Exception as e:
            self.logger.error(f"Transformation failed: {str(e)}")
            errors.append({
                'type': 'TRANSFORMATION_ERROR',
                'message': str(e),
                'timestamp': datetime.now()
            })
            
        return transformed_data, errors
    
    def _standardize_data_types(self, df: pd.DataFrame) -> pd.DataFrame:
        """Convert data types and standardize formats"""
        # Convert date columns
        date_columns = ['birth_date', 'registration_date', 'last_purchase_date']
        for col in date_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        # Convert numeric columns
        numeric_columns = ['income', 'credit_score', 'purchase_amount']
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Standardize string columns
        string_columns = ['first_name', 'last_name', 'email', 'phone']
        for col in string_columns:
            if col in df.columns:
                df[col] = df[col].astype(str).str.strip().str.title()
        
        return df
    
    def _cleanse_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[Dict]]:
        """Clean data by removing invalid values and standardizing formats"""
        errors = []
        
        # Remove rows with critical missing data
        critical_columns = ['first_name', 'last_name', 'email']
        initial_count = len(df)
        df = df.dropna(subset=critical_columns)
        removed_count = initial_count - len(df)
        
        if removed_count > 0:
            errors.append({
                'type': 'MISSING_CRITICAL_DATA',
                'count': removed_count,
                'columns': critical_columns
            })
        
        # Clean email addresses
        if 'email' in df.columns:
            df['email'] = df['email'].str.lower().str.strip()
            # Remove invalid email formats
            email_mask = df['email'].str.match(r'^[^@]+@[^@]+\\.[^@]+$')
            invalid_emails = df[~email_mask]['email'].count()
            df = df[email_mask]
            
            if invalid_emails > 0:
                errors.append({
                    'type': 'INVALID_EMAIL_FORMAT',
                    'count': invalid_emails
                })
        
        # Clean phone numbers
        if 'phone' in df.columns:
            df['phone'] = df['phone'].str.replace(r'[^0-9+()-]', '', regex=True)
            # Remove phone numbers that are too short
            phone_mask = df['phone'].str.len() >= 10
            invalid_phones = df[~phone_mask]['phone'].count()
            df = df[phone_mask]
            
            if invalid_phones > 0:
                errors.append({
                    'type': 'INVALID_PHONE_FORMAT',
                    'count': invalid_phones
                })
        
        return df, errors
    
    def _validate_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[Dict]]:
        """Apply business validation rules"""
        errors = []
        
        # Age validation
        if 'birth_date' in df.columns:
            age_mask = (datetime.now() - df['birth_date']).dt.days / 365.25 <= 120
            invalid_ages = df[~age_mask]['birth_date'].count()
            df = df[age_mask]
            
            if invalid_ages > 0:
                errors.append({
                    'type': 'INVALID_AGE',
                    'count': invalid_ages,
                    'rule': 'Age must be <= 120 years'
                })
        
        # Income validation
        if 'income' in df.columns:
            income_mask = (df['income'] >= 0) & (df['income'] <= 10000000)
            invalid_income = df[~income_mask]['income'].count()
            df = df[income_mask]
            
            if invalid_income > 0:
                errors.append({
                    'type': 'INVALID_INCOME',
                    'count': invalid_income,
                    'rule': 'Income must be between 0 and 10M'
                })
        
        # Credit score validation
        if 'credit_score' in df.columns:
            credit_mask = (df['credit_score'] >= 300) & (df['credit_score'] <= 850)
            invalid_credit = df[~credit_mask]['credit_score'].count()
            df = df[credit_mask]
            
            if invalid_credit > 0:
                errors.append({
                    'type': 'INVALID_CREDIT_SCORE',
                    'count': invalid_credit,
                    'rule': 'Credit score must be between 300 and 850'
                })
        
        return df, errors
    
    def _enrich_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add derived fields and external data"""
        # Calculate age from birth date
        if 'birth_date' in df.columns:
            df['age'] = (datetime.now() - df['birth_date']).dt.days / 365.25
        
        # Create customer segment based on income
        if 'income' in df.columns:
            df['customer_segment'] = pd.cut(
                df['income'],
                bins=[0, 50000, 100000, 200000, float('inf')],
                labels=['Budget', 'Standard', 'Premium', 'Luxury']
            )
        
        # Create full name
        if 'first_name' in df.columns and 'last_name' in df.columns:
            df['full_name'] = df['first_name'] + ' ' + df['last_name']
        
        # Add data quality score
        df['data_quality_score'] = self._calculate_quality_score(df)
        
        return df
    
    def _deduplicate_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Remove duplicate records based on business rules"""
        # Remove exact duplicates
        initial_count = len(df)
        df = df.drop_duplicates()
        
        # Remove duplicates based on email (business rule: unique email per customer)
        if 'email' in df.columns:
            df = df.drop_duplicates(subset=['email'], keep='first')
        
        # Remove duplicates based on phone (business rule: unique phone per customer)
        if 'phone' in df.columns:
            df = df.drop_duplicates(subset=['phone'], keep='first')
        
        final_count = len(df)
        removed_duplicates = initial_count - final_count
        
        if removed_duplicates > 0:
            self.logger.info(f"Removed {removed_duplicates} duplicate records")
        
        return df
    
    def _format_final_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply final formatting and select columns for target system"""
        # Select final columns in target order
        target_columns = [
            'customer_id', 'first_name', 'last_name', 'full_name', 'email',
            'phone', 'birth_date', 'age', 'income', 'credit_score',
            'customer_segment', 'data_quality_score', 'created_at', 'updated_at'
        ]
        
        # Only include columns that exist
        existing_columns = [col for col in target_columns if col in df.columns]
        df = df[existing_columns]
        
        # Reset index
        df = df.reset_index(drop=True)
        
        return df
    
    def _calculate_quality_score(self, df: pd.DataFrame) -> float:
        """Calculate data quality score based on completeness and validity"""
        total_cells = len(df) * len(df.columns)
        missing_cells = df.isnull().sum().sum()
        completeness = (total_cells - missing_cells) / total_cells
        
        # Additional quality factors could be added here
        # For now, return completeness score
        return round(completeness * 100, 2)`
      }
    },
    {
      title: "Batch Processing Orchestration",
      description: "Design a robust orchestration system for managing ETL batch jobs with dependencies and error handling.",
      icon: Workflow,
      content: `
        ## ETL Job Orchestration
        
        ### Job Dependencies
        - **Sequential Dependencies**: Jobs that must run in order
        - **Parallel Dependencies**: Independent jobs that can run simultaneously
        - **Conditional Dependencies**: Jobs that run based on conditions
        - **Time Dependencies**: Jobs scheduled at specific times
        
        ### Scheduling Strategies
        - **Cron-based**: Fixed time schedules
        - **Event-driven**: Triggered by data availability
        - **Dependency-based**: Run when prerequisites complete
        - **Resource-based**: Run when resources are available
        
        ### Error Handling & Recovery
        - **Retry Logic**: Automatic retry with exponential backoff
        - **Fallback Strategies**: Alternative processing paths
        - **Alerting**: Notifications for failures and issues
        - **Manual Intervention**: Human oversight for complex issues
        
        ### Monitoring & Observability
        - **Job Status Tracking**: Real-time job execution status
        - **Performance Metrics**: Execution time, resource usage
        - **Data Lineage**: Track data flow through the pipeline
        - **Audit Trails**: Complete execution history
      `,
      codeBlock: {
        language: 'yaml',
        code: `# ETL Job Orchestration with Apache Airflow
# dags/customer_etl_pipeline.py

from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash_operator import BashOperator
from airflow.operators.email_operator import EmailOperator
from airflow.utils.dates import days_ago
from datetime import timedelta
import logging

default_args = {
    'owner': 'data_engineering',
    'depends_on_past': False,
    'start_date': days_ago(1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
    'max_retry_delay': timedelta(minutes=30)
}

dag = DAG(
    'customer_etl_pipeline',
    default_args=default_args,
    description='Daily customer data ETL pipeline',
    schedule_interval='0 2 * * *',  # Daily at 2 AM
    catchup=False,
    max_active_runs=1
)

# Task 1: Extract customer data from source systems
extract_customers = PythonOperator(
    task_id='extract_customer_data',
    python_callable=extract_customer_data_func,
    op_kwargs={
        'source_systems': ['crm', 'website', 'mobile_app'],
        'extract_date': '{{ ds }}'
    },
    dag=dag
)

# Task 2: Validate extracted data
validate_data = PythonOperator(
    task_id='validate_extracted_data',
    python_callable=validate_data_func,
    op_kwargs={'validation_rules': 'customer_validation_rules.json'},
    dag=dag
)

# Task 3: Transform customer data
transform_customers = PythonOperator(
    task_id='transform_customer_data',
    python_callable=transform_customer_data_func,
    op_kwargs={
        'transformation_config': 'customer_transformation_config.json',
        'quality_threshold': 0.95
    },
    dag=dag
)

# Task 4: Load data to staging area
load_to_staging = PythonOperator(
    task_id='load_to_staging',
    python_callable=load_to_staging_func,
    op_kwargs={'target_schema': 'staging'},
    dag=dag
)

# Task 5: Run data quality checks
run_quality_checks = PythonOperator(
    task_id='run_data_quality_checks',
    python_callable=run_quality_checks_func,
    op_kwargs={'quality_checks': 'customer_quality_checks.json'},
    dag=dag
)

# Task 6: Load to production data warehouse
load_to_production = PythonOperator(
    task_id='load_to_production',
    python_callable=load_to_production_func,
    op_kwargs={'target_schema': 'dim_customers'},
    dag=dag
)

# Task 7: Update data lineage
update_lineage = PythonOperator(
    task_id='update_data_lineage',
    python_callable=update_lineage_func,
    op_kwargs={'pipeline_name': 'customer_etl_pipeline'},
    dag=dag
)

# Task 8: Send completion notification
send_notification = EmailOperator(
    task_id='send_completion_notification',
    to=['data-team@company.com'],
    subject='Customer ETL Pipeline Completed - {{ ds }}',
    html_content='''
    <h2>Customer ETL Pipeline Completed Successfully</h2>
    <p><strong>Date:</strong> {{ ds }}</p>
    <p><strong>Status:</strong> Success</p>
    <p><strong>Records Processed:</strong> {{ task_instance.xcom_pull(task_ids="transform_customers", key="records_processed") }}</p>
    <p><strong>Data Quality Score:</strong> {{ task_instance.xcom_pull(task_ids="run_quality_checks", key="quality_score") }}%</p>
    ''',
    dag=dag
)

# Define task dependencies
extract_customers >> validate_data >> transform_customers >> load_to_staging
load_to_staging >> run_quality_checks >> load_to_production
load_to_production >> update_lineage >> send_notification

# Error handling: If validation fails, send alert
validation_failure_alert = EmailOperator(
    task_id='validation_failure_alert',
    to=['data-team@company.com'],
    subject='Customer ETL Pipeline Validation Failed - {{ ds }}',
    html_content='''
    <h2>Customer ETL Pipeline Validation Failed</h2>
    <p><strong>Date:</strong> {{ ds }}</p>
    <p><strong>Task:</strong> {{ task.task_id }}</p>
    <p><strong>Error:</strong> {{ task_instance.xcom_pull(task_ids="validate_data", key="validation_errors") }}</p>
    ''',
    trigger_rule='one_failed',
    dag=dag
)

validate_data >> validation_failure_alert`
      }
    },
    {
      title: "Data Quality & Monitoring",
      description: "Implement comprehensive data quality monitoring and alerting for the ETL pipeline.",
      icon: Settings,
      content: `
        ## Data Quality Framework
        
        ### Quality Dimensions
        - **Completeness**: Percentage of non-null values
        - **Accuracy**: Data correctness and precision
        - **Consistency**: Uniformity across datasets
        - **Timeliness**: Data freshness and availability
        - **Validity**: Conformance to business rules
        
        ### Quality Checks
        - **Schema Validation**: Data type and format compliance
        - **Business Rule Validation**: Domain-specific constraints
        - **Statistical Validation**: Outlier detection and distribution analysis
        - **Cross-field Validation**: Relationship and dependency checks
        
        ### Monitoring & Alerting
        - **Real-time Monitoring**: Live quality metrics
        - **Threshold-based Alerting**: Notifications when quality drops
        - **Trend Analysis**: Quality degradation over time
        - **Root Cause Analysis**: Investigation tools for quality issues
        
        ### Quality Improvement
        - **Data Profiling**: Understanding data characteristics
        - **Quality Scoring**: Quantitative quality assessment
        - **Issue Tracking**: Systematic problem resolution
        - **Continuous Improvement**: Iterative quality enhancement
      `,
      codeBlock: {
        language: 'sql',
        code: `-- Data Quality Monitoring System
CREATE SCHEMA data_quality;

-- Quality check definitions
CREATE TABLE data_quality.check_definitions (
    check_id BIGSERIAL PRIMARY KEY,
    check_name VARCHAR(255) NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    column_name VARCHAR(255),
    check_type VARCHAR(100) NOT NULL,
    check_sql TEXT NOT NULL,
    threshold_value DECIMAL(10,2),
    severity VARCHAR(20) DEFAULT 'MEDIUM',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality check results
CREATE TABLE data_quality.check_results (
    result_id BIGSERIAL PRIMARY KEY,
    check_id BIGINT REFERENCES data_quality.check_definitions(check_id),
    run_timestamp TIMESTAMPTZ DEFAULT NOW(),
    table_name VARCHAR(255),
    column_name VARCHAR(255),
    expected_value TEXT,
    actual_value TEXT,
    status VARCHAR(20), -- PASS, FAIL, WARNING
    records_checked BIGINT,
    records_failed BIGINT,
    failure_rate DECIMAL(5,2),
    error_message TEXT
);

-- Data quality metrics
CREATE TABLE data_quality.quality_metrics (
    metric_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    metric_date DATE NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    threshold_value DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality alerts
CREATE TABLE data_quality.quality_alerts (
    alert_id BIGSERIAL PRIMARY KEY,
    check_id BIGINT REFERENCES data_quality.check_definitions(check_id),
    alert_type VARCHAR(50) NOT NULL, -- THRESHOLD_BREACH, TREND_DEGRADATION, ANOMALY
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    alert_timestamp TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by VARCHAR(100),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT
);

-- Sample quality checks
INSERT INTO data_quality.check_definitions (check_name, table_name, column_name, check_type, check_sql, threshold_value, severity, description) VALUES
('customer_email_format', 'dim_customers', 'email', 'FORMAT_VALIDATION', 'SELECT COUNT(*) FROM dim_customers WHERE email !~ ''^[^@]+@[^@]+\.[^@]+$''', 0, 'HIGH', 'Check email format validity'),
('customer_age_range', 'dim_customers', 'age', 'RANGE_VALIDATION', 'SELECT COUNT(*) FROM dim_customers WHERE age < 0 OR age > 120', 0, 'HIGH', 'Check age is within valid range'),
('customer_income_positive', 'dim_customers', 'income', 'RANGE_VALIDATION', 'SELECT COUNT(*) FROM dim_customers WHERE income < 0', 0, 'MEDIUM', 'Check income is non-negative'),
('customer_phone_format', 'dim_customers', 'phone', 'FORMAT_VALIDATION', 'SELECT COUNT(*) FROM dim_customers WHERE phone !~ ''^[0-9+()-]+$''', 0, 'MEDIUM', 'Check phone format validity'),
('customer_data_completeness', 'dim_customers', NULL, 'COMPLETENESS', 'SELECT COUNT(*) FROM dim_customers WHERE first_name IS NULL OR last_name IS NULL OR email IS NULL', 0, 'HIGH', 'Check required fields are not null');

-- Quality monitoring views
CREATE VIEW data_quality.v_quality_dashboard AS
SELECT 
    cd.check_name,
    cd.table_name,
    cd.column_name,
    cd.severity,
    cd.threshold_value,
    cr.status,
    cr.failure_rate,
    cr.run_timestamp,
    CASE 
        WHEN cr.status = 'FAIL' THEN 'CRITICAL'
        WHEN cr.status = 'WARNING' THEN 'WARNING'
        ELSE 'HEALTHY'
    END as alert_level
FROM data_quality.check_definitions cd
LEFT JOIN data_quality.check_results cr ON cd.check_id = cr.check_id
WHERE cd.is_active = TRUE
AND cr.run_timestamp = (
    SELECT MAX(run_timestamp) 
    FROM data_quality.check_results 
    WHERE check_id = cd.check_id
)
ORDER BY cd.severity DESC, cr.status DESC;

-- Quality trend analysis
CREATE VIEW data_quality.v_quality_trends AS
SELECT 
    table_name,
    metric_type,
    metric_date,
    metric_value,
    LAG(metric_value) OVER (PARTITION BY table_name, metric_type ORDER BY metric_date) as previous_value,
    ROUND(((metric_value - LAG(metric_value) OVER (PARTITION BY table_name, metric_type ORDER BY metric_date)) / LAG(metric_value) OVER (PARTITION BY table_name, metric_type ORDER BY metric_date)) * 100, 2) as change_pct
FROM data_quality.quality_metrics
WHERE metric_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY table_name, metric_type, metric_date;

-- Function to run quality checks
CREATE OR REPLACE FUNCTION run_quality_checks(p_table_name VARCHAR DEFAULT NULL)
RETURNS TABLE(check_name VARCHAR, status VARCHAR, records_checked BIGINT, records_failed BIGINT, failure_rate DECIMAL) AS $$
DECLARE
    check_record RECORD;
    result_record RECORD;
    check_sql TEXT;
    expected_count BIGINT;
    actual_count BIGINT;
BEGIN
    FOR check_record IN 
        SELECT * FROM data_quality.check_definitions 
        WHERE is_active = TRUE 
        AND (p_table_name IS NULL OR table_name = p_table_name)
    LOOP
        -- Execute the check SQL
        EXECUTE check_record.check_sql INTO actual_count;
        
        -- Determine status based on threshold
        IF actual_count <= check_record.threshold_value THEN
            status := 'PASS';
        ELSIF actual_count <= check_record.threshold_value * 1.5 THEN
            status := 'WARNING';
        ELSE
            status := 'FAIL';
        END IF;
        
        -- Get total records for the table
        EXECUTE format('SELECT COUNT(*) FROM %I', check_record.table_name) INTO expected_count;
        
        -- Calculate failure rate
        failure_rate := CASE 
            WHEN expected_count > 0 THEN ROUND((actual_count::DECIMAL / expected_count) * 100, 2)
            ELSE 0
        END;
        
        -- Store result
        INSERT INTO data_quality.check_results (
            check_id, table_name, column_name, expected_value, actual_value, 
            status, records_checked, records_failed, failure_rate
        ) VALUES (
            check_record.check_id, check_record.table_name, check_record.column_name,
            check_record.threshold_value::TEXT, actual_count::TEXT, status,
            expected_count, actual_count, failure_rate
        );
        
        -- Return result
        check_name := check_record.check_name;
        records_checked := expected_count;
        records_failed := actual_count;
        
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;`
      }
    }
  ]

  const implementationChecklist = [
    {
      id: '1',
      title: 'Data Architecture Design',
      description: 'Design staging areas and data flow architecture',
      category: 'planning' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Create raw, staging, processed, and archive zones with proper schemas'
    },
    {
      id: '2',
      title: 'ETL Pipeline Development',
      description: 'Implement data extraction, transformation, and loading logic',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Build robust transformation logic with error handling and data quality checks'
    },
    {
      id: '3',
      title: 'Job Orchestration',
      description: 'Set up workflow orchestration and scheduling',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Configure job dependencies, scheduling, and error handling with Airflow or similar'
    },
    {
      id: '4',
      title: 'Data Quality Framework',
      description: 'Implement comprehensive data quality monitoring',
      category: 'planning' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Set up validation rules, quality metrics, and monitoring dashboards'
    },
    {
      id: '5',
      title: 'Error Handling & Recovery',
      description: 'Establish robust error handling and recovery mechanisms',
      category: 'implementation' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Implement retry logic, fallback strategies, and manual intervention processes'
    },
    {
      id: '6',
      title: 'Performance Optimization',
      description: 'Optimize pipeline performance and resource usage',
      category: 'testing' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Implement partitioning, indexing, and resource management for optimal performance'
    },
    {
      id: '7',
      title: 'Monitoring & Alerting',
      description: 'Set up comprehensive monitoring and alerting',
      category: 'monitoring' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Implement job tracking, performance metrics, and alerting for failures'
    }
  ]

  // Decision tree structure must follow the DecisionNode interface:
  // - Each node needs: id, title, description, question, options[]
  // - Each option needs: id, label, description, nextNode?, pros[], cons[], recommendation?
  const decisionTree = {
    title: "ETL Batch Pipeline Architecture Decisions",
    description: "Decision tree for choosing the right ETL batch processing architecture",
    nodes: [
      {
        id: 'start',
        title: 'Data Volume Assessment',
        description: 'Determine your data processing volume requirements',
        question: 'What is your data volume requirement?',
        options: [
          {
            id: 'small-volume-option',
            label: 'Small volume (< 1GB/day)',
            description: 'Use simple file-based processing or basic ETL tools',
            nextNode: 'small-volume',
            pros: ['Simple setup', 'Low cost', 'Easy maintenance'],
            cons: ['Limited scalability', 'Basic features'],
            recommendation: 'Start with simple tools and scale as needed'
          },
          {
            id: 'medium-volume-option',
            label: 'Medium volume (1GB-100GB/day)',
            description: 'Use database-based ETL or mid-range tools',
            nextNode: 'medium-volume',
            pros: ['Good balance', 'Moderate cost', 'Decent features'],
            cons: ['Some complexity', 'Limited scaling'],
            recommendation: 'Use mid-range tools for balanced approach'
          },
          {
            id: 'large-volume-option',
            label: 'Large volume (> 100GB/day)',
            description: 'Use distributed processing frameworks like Spark',
            nextNode: 'large-volume',
            pros: ['High scalability', 'Advanced features', 'Enterprise ready'],
            cons: ['High complexity', 'High cost', 'Expertise required'],
            recommendation: 'Use distributed frameworks for large-scale processing'
          }
        ]
      },
              {
          id: 'small-volume',
          title: 'Processing Frequency for Small Volume',
          description: 'Choose the appropriate processing frequency for small data volumes',
          question: 'What is your processing frequency?',
          options: [
            {
              id: 'real-time-small',
              label: 'Real-time/streaming',
              description: 'Consider streaming solutions instead of batch',
              nextNode: 'real-time-small',
              pros: ['Immediate insights', 'Real-time decision making'],
              cons: ['Higher complexity', 'More expensive'],
              recommendation: 'Consider streaming solutions for real-time needs'
            },
            {
              id: 'daily-batch-small',
              label: 'Daily batch',
              description: 'Use simple scheduling with cron or basic ETL tools',
              nextNode: 'daily-batch-small',
              pros: ['Simple setup', 'Cost-effective', 'Easy maintenance'],
              cons: ['Delayed insights', 'Limited real-time capabilities'],
              recommendation: 'Use daily batch for simple ETL needs'
            },
            {
              id: 'weekly-batch-small',
              label: 'Weekly/monthly batch',
              description: 'Use manual or simple automated processes',
              nextNode: 'weekly-batch-small',
              pros: ['Minimal setup', 'Very low cost', 'Simple maintenance'],
              cons: ['Very delayed insights', 'Limited automation'],
              recommendation: 'Use weekly/monthly batch for infrequent updates'
            }
          ]
        },
        {
          id: 'medium-volume',
          title: 'Team Expertise Assessment',
          description: 'Evaluate your team\'s technical expertise level',
          question: 'What is your team expertise level?',
          options: [
            {
              id: 'high-expertise-medium',
              label: 'High expertise',
              description: 'Use Apache Airflow or custom orchestration',
              nextNode: 'high-expertise-medium',
              pros: ['Full control', 'Custom workflows', 'Advanced features'],
              cons: ['High complexity', 'More maintenance', 'Expertise required'],
              recommendation: 'Use Apache Airflow for complex orchestration'
            },
            {
              id: 'medium-expertise-medium',
              label: 'Medium expertise',
              description: 'Use managed ETL services or mid-range tools',
              nextNode: 'medium-expertise-medium',
              pros: ['Balanced complexity', 'Good features', 'Moderate maintenance'],
              cons: ['Some vendor lock-in', 'Limited customization'],
              recommendation: 'Use managed services for balanced approach'
            }
          ]
        }
    ]
  }

  const tools = [
    {
      id: 'apache-airflow',
      name: 'Apache Airflow',
      category: 'orchestration' as const,
      description: 'Platform to programmatically author, schedule, and monitor workflows',
      features: ['DAG-based workflows', 'Rich UI', 'Extensible', 'Python-based'],
      pros: ['Excellent UI', 'Rich ecosystem', 'Python native', 'Active community'],
      cons: ['Complex setup', 'Resource intensive', 'Steep learning curve'],
      bestFor: ['Complex workflow orchestration and scheduling'],
      notFor: ['Simple batch processing'],
      pricing: 'free' as const,
      rating: 4.7,
      marketShare: 'High',
      learningCurve: 'hard' as const,
      community: 'large' as const,
      documentation: 'excellent' as const
    },
    {
      id: 'apache-spark',
      name: 'Apache Spark',
      category: 'processing' as const,
      description: 'Unified analytics engine for large-scale data processing',
      features: ['Batch processing', 'Streaming', 'ML support', 'Graph processing'],
      pros: ['Excellent performance', 'Rich APIs', 'Scalable', 'Active development'],
      cons: ['Complex configuration', 'Resource intensive', 'Steep learning curve'],
      bestFor: ['Large-scale data processing and analytics'],
      notFor: ['Simple data transformations'],
      pricing: 'free' as const,
      rating: 4.8,
      marketShare: 'Very High',
      learningCurve: 'hard' as const,
      community: 'large' as const,
      documentation: 'excellent' as const
    },
    {
      id: 'talend',
      name: 'Talend',
      category: 'etl' as const,
      description: 'Data integration platform with visual design tools',
      features: ['Visual design', 'Data quality', 'Metadata management', 'Enterprise features'],
      pros: ['Easy to use', 'Rich features', 'Good support', 'Enterprise ready'],
      cons: ['Expensive', 'Vendor lock-in', 'Limited customization'],
      bestFor: ['Enterprise ETL with visual design requirements'],
      notFor: ['Custom processing logic'],
      pricing: 'enterprise' as const,
      rating: 4.3,
      marketShare: 'Medium',
      learningCurve: 'medium' as const,
      community: 'medium' as const,
      documentation: 'good' as const
    },
    {
      id: 'apache-nifi',
      name: 'Apache NiFi',
      category: 'etl' as const,
      description: 'Data flow automation tool for real-time data ingestion',
      features: ['Visual flow design', 'Real-time processing', 'Data provenance', 'Scalable'],
      pros: ['Easy to use', 'Real-time capabilities', 'Good monitoring', 'Scalable'],
      cons: ['Limited transformation capabilities', 'Resource intensive', 'Complex setup'],
      bestFor: ['Data ingestion and routing'],
      notFor: ['Complex data transformations'],
      pricing: 'free' as const,
      rating: 4.2,
      marketShare: 'Medium',
      learningCurve: 'medium' as const,
      community: 'medium' as const,
      documentation: 'good' as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">ETL Batch Pipeline</h1>
              <p className="text-muted-foreground">Comprehensive guide to building robust ETL batch processing pipelines</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Batch Processing</span>
              </div>
              <p className="text-sm text-muted-foreground">Efficient processing of large datasets in scheduled batches</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="font-semibold">Data Quality</span>
              </div>
              <p className="text-sm text-muted-foreground">Comprehensive validation and quality monitoring</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Workflow className="h-4 w-4 text-orange-600" />
                <span className="font-semibold">Orchestration</span>
              </div>
              <p className="text-sm text-muted-foreground">Robust job scheduling and dependency management</p>
            </div>
          </div>
        </div>

        {/* Tutorial Sections */}
        <div className="space-y-8">
          {tutorialSteps.map((step, index) => (
            <TutorialSection
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              content={step.content}
              codeBlock={step.codeBlock}
            />
          ))}
        </div>

        {/* Implementation Checklist */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Implementation Checklist</h2>
          <ImplementationChecklist 
            title="ETL Batch Pipeline Implementation Checklist"
            description="Follow this comprehensive checklist to ensure successful implementation of your ETL batch processing pipeline"
            items={implementationChecklist}
          />
        </div>

        {/* Architecture Decision Tree */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Architecture Decision Tree</h2>
          <ArchitectureDiagram 
            title={decisionTree.title}
            description={decisionTree.description}
            type="decision-tree"
            content={decisionTree.nodes}
          />
        </div>

        {/* Tool Comparison */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technology Stack Comparison</h2>
          <ToolComparison 
            title="Technology Stack Comparison"
            description="Compare different ETL and orchestration tools"
            tools={tools}
            features={[]}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your ETL Batch Pipeline?</h2>
          <p className="text-blue-100 mb-6">
            Start implementing these patterns to create a robust and scalable ETL processing system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Download Architecture Template
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
