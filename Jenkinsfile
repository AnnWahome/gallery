pipeline {
    agent any

    tools {
        nodejs 'NodeJS'  // NodeJS tool setup for running npm
        //git 'Default'    // Default git tool
    }

    environment {
        NODE_ENV = 'production'
        GITHUB_REPO = 'https://github.com/AnnWahome/gallery.git'
        BRANCH = 'master'
        RENDER_API_KEY = credentials('render-api-key')  // API Key stored as a Jenkins secret
        RENDER_SERVICE_ID = 'srv-ct26gbdsvqrc73e58lj0'  // Service ID from Render
        EMAIL_RECIPIENTS = 'ann.wahome@student.moringaschool.com'
        SLACK_WEBHOOK_URL = credentials('slack-webhook-url')  // Slack webhook URL for notifications
        MONGODB_URI = 'mongodb+srv://annsonnie1:Annsonnie@123@devopscluster1.okwjc.mongodb.net/darkroom?retryWrites=true&w=majority' 
    }

    triggers {
        // Trigger the pipeline on each push to the repository
        gitHubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Checkout code from GitHub repository
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        // Run tests using npm
                        def testResult = sh(script: 'npm test', returnStatus: true)
                        
                        if (testResult != 0) {
                            currentBuild.result = 'FAILURE'
                            error "Tests failed"
                        }
                    } catch (Exception e) {
                        // If tests fail, send an email notification
                        emailext(
                            subject: "Jenkins Build Failed: Tests Failed",
                            body: "The Jenkins build has failed due to failing tests. Please check the logs for more details.",
                            to: EMAIL_RECIPIENTS
                        )
                        throw e  // Stop the pipeline after failure
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'  // Execute the build command
            }
        }

        stage('Deploy to Render') {
            steps {
                script {
                    // Deploy to Render using API
                    def deployResponse = sh(script: """
                        curl -X POST https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys \
                            -H "Authorization: Bearer ${RENDER_API_KEY}" \
                            -d '{"clear_cache": false}' \
                            -w "%{http_code}" -s
                    """, returnStdout: true).trim()

                    // Check if the deployment was successful
                    if (deployResponse == '200') {
                        echo "Deployment triggered successfully."
                    } else {
                        error "Deployment failed with response code: ${deployResponse}"
                    }
                }
            }
        }

        stage('Slack Notification') {
            steps {
                script {
                    // Send a message to Slack channel after a successful deployment
                    def buildUrl = env.BUILD_URL
                    def renderUrl = 'https://gallery-stjr.onrender.com'  // Render URL
                    def slackMessage = """
                    :rocket: Deployment Successful!

                    Build ID: ${env.BUILD_ID}
                    View the build: ${buildUrl}
                    View the app on Render: ${renderUrl}
                    """
                    // Send Slack notification
                    slackSend(channel: '#YourFirstName_IP1', message: slackMessage, webhookUrl: SLACK_WEBHOOK_URL)
                }
            }
        }
    }

    post {
        always {
            // Always run cleanup steps
            echo 'Cleaning up...'
        }
        success {
            // Actions if successful
            echo 'Build and tests passed!'
        }
        failure {
            // Send an email if the build or tests fail
            echo 'Build failed!'
            mail to: "${EMAIL_RECIPIENTS}",
                 subject: "Jenkins Build Failed: ${currentBuild.fullDisplayName}",
                 body: "The build failed due to failing tests or deployment issues. Please check the logs for details."
        }
    }
}
