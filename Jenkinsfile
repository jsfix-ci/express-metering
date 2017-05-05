pipeline {
  agent {
    docker {
      image 'test'
    }
    
  }
  stages {
    stage('') {
      steps {
        parallel(
          "test1": {
            echo 'sevlam'
            
          },
          "test2": {
            echo 'parallel2'
            
          }
        )
      }
    }
    stage('final') {
      steps {
        echo 'serial'
      }
    }
  }
}