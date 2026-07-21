pipeline {
    agent any

    tools {
        nodejs 'NodeJS' // must match name in Manage Jenkins > Tools
    }

    environment {
        NODE_ENV = 'production'
        NEXT_PUBLIC_API_URL = credentials('next-public-api-url') // example for public env vars
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || true' // remove "|| true" once lint passes cleanly
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --ci || true' // remove "|| true" once you have tests set up
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Archive Build') {
            steps {
                // .next folder holds the production build
                sh 'tar -czf build.tar.gz .next public package.json package-lock.json next.config.js'
                archiveArtifacts artifacts: 'build.tar.gz', fingerprint: true
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // See deployment options below — pick the one that matches your setup
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Build succeeded!'
        }
        failure {
            echo '❌ Build failed — check logs above.'
        }
    }
}
