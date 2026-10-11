
pipeline {
    agent any

    tools {
        nodejs 'Node22'
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

        stage('Build React Application') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            echo 'Committee X build completed successfully!'
        }

        failure {
            echo 'Build failed. Check the Jenkins Console Output.'
        }
    }
}
