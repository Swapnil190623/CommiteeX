
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build React Application') {
            steps {
                bat 'npm run build'
            }
        }
    }

    post {
        success {
            echo 'Committee X build completed successfully!'
        }

        failure {
            echo 'Committee X pipeline failed. Check the console output.'
        }
    }
}
