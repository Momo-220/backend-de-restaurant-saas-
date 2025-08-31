# ===================================================================
# TERRAFORM CONFIGURATION - FREE TIER ONLY
# Coût : 0€/mois pendant 12 mois
# ===================================================================

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ===================================================================
# VARIABLES
# ===================================================================

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"  # Région avec Free Tier généreux
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "restaurant-saas"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# ===================================================================
# VPC - VERSION SIMPLIFIÉE (FREE TIER)
# ===================================================================

# VPC principale
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.app_name}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway (GRATUIT)
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.app_name}-igw"
  }
}

# Subnet PUBLIC (pas de NAT Gateway = GRATUIT)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-public-subnet"
    Type = "Public"
  }
}

# Route Table pour subnet public
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.app_name}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ===================================================================
# SECURITY GROUPS
# ===================================================================

# Security Group pour ECS
resource "aws_security_group" "ecs" {
  name_prefix = "${var.app_name}-ecs-"
  vpc_id      = aws_vpc.main.id

  # HTTP/HTTPS depuis CloudFlare
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # CloudFlare IP ranges
  }

  # Sortie vers internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-ecs-sg"
  }
}

# Security Group pour RDS
resource "aws_security_group" "rds" {
  name_prefix = "${var.app_name}-rds-"
  vpc_id      = aws_vpc.main.id

  # PostgreSQL depuis ECS uniquement
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  tags = {
    Name = "${var.app_name}-rds-sg"
  }
}

# Security Group pour Redis
resource "aws_security_group" "redis" {
  name_prefix = "${var.app_name}-redis-"
  vpc_id      = aws_vpc.main.id

  # Redis depuis ECS uniquement
  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  tags = {
    Name = "${var.app_name}-redis-sg"
  }
}

# ===================================================================
# RDS POSTGRESQL - FREE TIER
# ===================================================================

# Subnet group pour RDS
resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-db-subnet-group"
  subnet_ids = [aws_subnet.public.id, aws_subnet.public_secondary.id]

  tags = {
    Name = "${var.app_name}-db-subnet-group"
  }
}

# Subnet secondaire pour RDS (obligatoire)
resource "aws_subnet" "public_secondary" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "${var.app_name}-public-subnet-2"
  }
}

# RDS PostgreSQL - FREE TIER t3.micro
resource "aws_db_instance" "main" {
  identifier = "${var.app_name}-db"

  # FREE TIER CONFIGURATION
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"  # FREE TIER
  allocated_storage = 20          # FREE TIER (20GB)
  storage_type   = "gp2"          # FREE TIER

  # Database
  db_name  = "restaurant_saas"
  username = "postgres"
  password = var.db_password

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # FREE TIER OPTIMIZATIONS
  backup_retention_period = 0     # Pas de backup auto (GRATUIT)
  backup_window          = null   # Pas de backup auto
  maintenance_window     = "sun:03:00-sun:04:00"
  
  # Pas de monitoring avancé (GRATUIT)
  monitoring_interval = 0
  
  # Pas de chiffrement (GRATUIT)
  storage_encrypted = false
  
  # Pas de Multi-AZ (GRATUIT)
  multi_az = false

  # Pas de suppression accidentelle
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "${var.app_name}-final-snapshot"

  tags = {
    Name = "${var.app_name}-database"
    Environment = var.environment
  }
}

# ===================================================================
# ELASTICACHE REDIS - FREE TIER
# ===================================================================

# Subnet group pour Redis
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.app_name}-cache-subnet"
  subnet_ids = [aws_subnet.public.id, aws_subnet.public_secondary.id]
}

# Redis - FREE TIER t3.micro
resource "aws_elasticache_replication_group" "main" {
  replication_group_id       = "${var.app_name}-redis"
  description                = "Redis cluster for ${var.app_name}"

  # FREE TIER CONFIGURATION
  node_type            = "cache.t3.micro"  # FREE TIER
  port                 = 6379
  parameter_group_name = "default.redis7"

  # Pas de cluster mode (GRATUIT)
  num_cache_clusters = 1
  
  # Network
  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  # FREE TIER OPTIMIZATIONS
  at_rest_encryption_enabled = false  # GRATUIT
  transit_encryption_enabled = false  # GRATUIT
  
  # Pas de backup automatique (GRATUIT)
  snapshot_retention_limit = 0
  
  # Pas de Multi-AZ (GRATUIT)
  automatic_failover_enabled = false

  tags = {
    Name = "${var.app_name}-redis"
    Environment = var.environment
  }
}

# ===================================================================
# S3 BUCKET - FREE TIER
# ===================================================================

# Bucket S3 pour uploads
resource "aws_s3_bucket" "uploads" {
  bucket = "${var.app_name}-uploads-${random_string.bucket_suffix.result}"

  tags = {
    Name = "${var.app_name}-uploads"
    Environment = var.environment
  }
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Configuration du bucket
resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Disabled"  # GRATUIT (pas de versioning)
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"  # GRATUIT (pas KMS)
    }
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ===================================================================
# ECS CLUSTER - FREE TIER
# ===================================================================

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"

  # FREE TIER - Pas d'insights
  setting {
    name  = "containerInsights"
    value = "disabled"  # GRATUIT
  }

  tags = {
    Name = "${var.app_name}-cluster"
    Environment = var.environment
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.app_name}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = "256"   # FREE TIER
  memory                  = "512"   # FREE TIER
  execution_role_arn      = aws_iam_role.ecs_execution.arn
  task_role_arn          = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${aws_ecr_repository.app.repository_url}:latest"
      
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "3000"
        }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_secretsmanager_secret.database_url.arn
        },
        {
          name      = "REDIS_HOST"
          valueFrom = aws_secretsmanager_secret.redis_host.arn
        },
        {
          name      = "JWT_SECRET"
          valueFrom = aws_secretsmanager_secret.jwt_secret.arn
        },
        {
          name      = "AWS_S3_BUCKET"
          valueFrom = aws_secretsmanager_secret.s3_bucket.arn
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      essential = true
    }
  ])

  tags = {
    Name = "${var.app_name}-task"
  }
}

# ECS Service - PUBLIC (pas d'ALB)
resource "aws_ecs_service" "app" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public.id]
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true  # IP publique directe
  }

  # Pas de load balancer (GRATUIT)
  # Le trafic arrive directement via CloudFlare

  depends_on = [aws_ecs_cluster.main]

  tags = {
    Name = "${var.app_name}-service"
  }
}

# ===================================================================
# ECR REPOSITORY - FREE TIER
# ===================================================================

resource "aws_ecr_repository" "app" {
  name                 = "${var.app_name}-backend"
  image_tag_mutability = "MUTABLE"

  # FREE TIER - Pas de scan
  image_scanning_configuration {
    scan_on_push = false  # GRATUIT
  }

  tags = {
    Name = "${var.app_name}-ecr"
  }
}

# ===================================================================
# CLOUDWATCH LOGS - FREE TIER
# ===================================================================

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.app_name}-backend"
  retention_in_days = 7  # FREE TIER (courte rétention)

  tags = {
    Name = "${var.app_name}-logs"
  }
}

# ===================================================================
# SECRETS MANAGER - GRATUIT 30 JOURS
# ===================================================================

resource "aws_secretsmanager_secret" "database_url" {
  name = "${var.app_name}/database-url"
  description = "Database connection URL"
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id = aws_secretsmanager_secret.database_url.id
  secret_string = "postgresql://postgres:${var.db_password}@${aws_db_instance.main.endpoint}:5432/restaurant_saas"
}

resource "aws_secretsmanager_secret" "redis_host" {
  name = "${var.app_name}/redis-host"
  description = "Redis endpoint"
}

resource "aws_secretsmanager_secret_version" "redis_host" {
  secret_id = aws_secretsmanager_secret.redis_host.id
  secret_string = aws_elasticache_replication_group.main.configuration_endpoint_address
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "${var.app_name}/jwt-secret"
  description = "JWT Secret Key"
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id = aws_secretsmanager_secret.jwt_secret.id
  secret_string = random_password.jwt_secret.result
}

resource "random_password" "jwt_secret" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "s3_bucket" {
  name = "${var.app_name}/s3-bucket"
  description = "S3 bucket name"
}

resource "aws_secretsmanager_secret_version" "s3_bucket" {
  secret_id = aws_secretsmanager_secret.s3_bucket.id
  secret_string = aws_s3_bucket.uploads.bucket
}

# ===================================================================
# IAM ROLES
# ===================================================================

# ECS Execution Role
resource "aws_iam_role" "ecs_execution" {
  name = "${var.app_name}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Policy pour Secrets Manager
resource "aws_iam_role_policy" "ecs_secrets" {
  name = "${var.app_name}-ecs-secrets-policy"
  role = aws_iam_role.ecs_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          aws_secretsmanager_secret.database_url.arn,
          aws_secretsmanager_secret.redis_host.arn,
          aws_secretsmanager_secret.jwt_secret.arn,
          aws_secretsmanager_secret.s3_bucket.arn
        ]
      }
    ]
  })
}

# ECS Task Role
resource "aws_iam_role" "ecs_task" {
  name = "${var.app_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Policy pour S3
resource "aws_iam_role_policy" "ecs_s3" {
  name = "${var.app_name}-ecs-s3-policy"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.uploads.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.uploads.arn
      }
    ]
  })
}

# ===================================================================
# OUTPUTS
# ===================================================================

output "ecs_service_public_ip" {
  description = "IP publique du service ECS"
  value = "Voir dans la console ECS"
}

output "database_endpoint" {
  description = "RDS endpoint"
  value = aws_db_instance.main.endpoint
}

output "redis_endpoint" {
  description = "Redis endpoint"  
  value = aws_elasticache_replication_group.main.configuration_endpoint_address
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value = aws_s3_bucket.uploads.bucket
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value = aws_ecr_repository.app.repository_url
}

output "estimated_cost" {
  description = "Coût estimé"
  value = "0€/mois pendant 12 mois avec Free Tier AWS"
}











