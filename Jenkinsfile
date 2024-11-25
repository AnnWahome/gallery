pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        git 'Default'
    }

    environment {
        NODE_ENV = 'production'
        GITHUB_REPO = 'https://github.com/AnnWahome/gallery.git'
        BRANCH = 'master'
        RENDER_API_KEY = credentials('render-api-key')  // API Key stored as a Jenkins secret
        RENDER_SERVICE_ID = 'srv-ct26gbdsvqrc73e58lj0'  // Service ID from Render
    }

    stages {
        stage('Checkout') {
            steps {
                               git url: "${GITHUB_REPO}", credentialsId: 'github-credentials', branch: "${BRANCH}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Render') {
            steps {
                script {
                    sh """
                        curl -X POST \
                             -H "Authorization: Bearer ${RENDER_API_KEY}" \
                             -H "Content-Type: application/json" \
                             -d '{
                                "service_id": "${RENDER_SERVICE_ID}",
                                "branch": "${BRANCH}"
                             }' \
                             https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deployments
                    """
                }
            }
        }
    }
    post {
        success {
            echo 'Deployment Successful'
        }
        failure {
            echo 'Deployment Failed'
        }
    }
}