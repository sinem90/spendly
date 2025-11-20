#!/bin/bash

# Spendly Frontend Deployment Script
# Deploys the frontend to AWS S3 with detailed logging

set -e  # Exit on any error

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
S3_BUCKET="spendly-app-frontend-2024"
BUILD_DIR="dist"

# Helper function for logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Print header
echo "=================================================="
echo -e "${GREEN}Spendly Frontend Deployment${NC}"
echo "=================================================="
echo ""

# Step 1: Check if AWS CLI is installed
log_info "Checking AWS CLI installation..."
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    exit 1
fi
log_success "AWS CLI is installed"

# Step 2: Verify AWS credentials
log_info "Verifying AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
log_success "AWS credentials verified (Account: $ACCOUNT_ID)"

# Step 3: Clean old build
log_info "Cleaning previous build..."
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    log_success "Removed old build directory"
else
    log_info "No previous build found"
fi

# Step 4: Install dependencies
log_info "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    log_warning "node_modules not found. Installing dependencies..."
    npm install
    log_success "Dependencies installed"
else
    log_success "Dependencies already installed"
fi

# Step 5: Build the frontend
log_info "Building frontend for production..."
echo ""
if npm run build; then
    echo ""
    log_success "Frontend build completed successfully"
else
    echo ""
    log_error "Build failed. Please check the errors above."
    exit 1
fi

# Step 6: Verify build output
log_info "Verifying build output..."
if [ ! -d "$BUILD_DIR" ]; then
    log_error "Build directory not found. Build may have failed."
    exit 1
fi

FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l | xargs)
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
log_success "Build directory contains $FILE_COUNT files (Total size: $BUILD_SIZE)"

# Step 7: Check S3 bucket exists
log_info "Verifying S3 bucket: $S3_BUCKET..."
if aws s3 ls "s3://$S3_BUCKET" &> /dev/null; then
    log_success "S3 bucket verified"
else
    log_error "S3 bucket '$S3_BUCKET' not found or not accessible"
    exit 1
fi

# Step 8: Upload files with correct MIME types
log_info "Uploading files to S3 with correct MIME types..."
echo ""

# Upload HTML files
log_info "Uploading HTML files..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET" \
  --delete \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html" \
  --cache-control "no-cache,no-store,must-revalidate"

# Upload JavaScript files
log_info "Uploading JavaScript files..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET" \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  --cache-control "max-age=31536000,public"

# Upload CSS files
log_info "Uploading CSS files..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET" \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  --cache-control "max-age=31536000,public"

# Upload images
log_info "Uploading image files..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET" \
  --exclude "*" \
  --include "*.png" \
  --include "*.jpg" \
  --include "*.jpeg" \
  --include "*.gif" \
  --include "*.svg" \
  --include "*.ico" \
  --cache-control "max-age=31536000,public"

# Upload any other files
log_info "Uploading remaining files..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET" \
  --exclude "*.html" \
  --exclude "*.js" \
  --exclude "*.css" \
  --exclude "*.png" \
  --exclude "*.jpg" \
  --exclude "*.jpeg" \
  --exclude "*.gif" \
  --exclude "*.svg" \
  --exclude "*.ico"

echo ""
log_success "All files uploaded with correct MIME types"

# Step 10: Check for CloudFront distribution
log_info "Checking for CloudFront distribution..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Origins.Items[?DomainName=='$S3_BUCKET.s3.amazonaws.com']].Id" \
  --output text 2>/dev/null || echo "")

if [ -n "$DISTRIBUTION_ID" ] && [ "$DISTRIBUTION_ID" != "None" ]; then
    log_info "CloudFront distribution found: $DISTRIBUTION_ID"
    log_info "Creating cache invalidation..."

    INVALIDATION_ID=$(aws cloudfront create-invalidation \
      --distribution-id "$DISTRIBUTION_ID" \
      --paths "/*" \
      --query 'Invalidation.Id' \
      --output text)

    log_success "CloudFront invalidation created: $INVALIDATION_ID"
    log_warning "Note: Cache invalidation may take 5-15 minutes to complete"
else
    log_info "No CloudFront distribution found (using S3 direct hosting)"
fi

# Step 11: Get website URL
log_info "Retrieving website URL..."
REGION=$(aws s3api get-bucket-location --bucket "$S3_BUCKET" --output text)
if [ "$REGION" == "None" ]; then
    REGION="us-east-1"
fi

if [ "$REGION" == "us-east-1" ]; then
    WEBSITE_URL="http://$S3_BUCKET.s3-website-us-east-1.amazonaws.com"
else
    WEBSITE_URL="http://$S3_BUCKET.s3-website-$REGION.amazonaws.com"
fi

# Final summary
echo ""
echo "=================================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}Website URL:${NC} $WEBSITE_URL"
echo ""
echo -e "${BLUE}Deployment Summary:${NC}"
echo "  • Build size: $BUILD_SIZE"
echo "  • Files uploaded: $FILE_COUNT"
echo "  • S3 Bucket: s3://$S3_BUCKET"
if [ -n "$DISTRIBUTION_ID" ] && [ "$DISTRIBUTION_ID" != "None" ]; then
    echo "  • CloudFront: $DISTRIBUTION_ID (invalidation in progress)"
fi
echo ""
log_success "Your changes are now live!"
echo ""
