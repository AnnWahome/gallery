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
        EMAIL_RECIPIENTS = 'ann.wahome@student.moringaschool.com'
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
                     def deployResponse = sh(script: """
                        curl -X POST https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys \
                            -H "Authorization: Bearer ${RENDER_API_KEY}" \
                            -d '{"clear_cache": false}' \
                            -w "%{http_code}" -s
                    """, returnStdout: true).trim()

                    // Check the response code to verify success
                    if (deployResponse == '200') {
                        echo "Deployment triggered successfully."
                    } else {
                        error "Deployment failed with response code: ${deployResponse}"
                    }
                }
            }
        }
         stage('Run Tests') {
            steps {
                script {
                    // Run your tests
                    def testResult = sh(script: 'npm test', returnStatus: true)
                    
                    if (testResult != 0) {
                        currentBuild.result = 'FAILURE'
                        error "Tests failed"
                    }
                }
            }
        }
    }
    post {
        always {
            // Always run
            echo 'Cleaning up...'
        }
        success {
            // Actions if successful
            echo 'Build and tests passed!'
        }
        failure {
            // Send an email if the tests fail
            echo 'Build failed!'
            mail to: "${EMAIL_RECIPIENTS}",
                 subject: "Jenkins Build Failed: ${currentBuild.fullDisplayName}",
                 body: "The build failed due to failing tests. Please check the logs for details."
        }
    }
}