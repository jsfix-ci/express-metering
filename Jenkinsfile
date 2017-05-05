pipeline {
  agent {
    node {
      label 'test'
    }
    
  }
  stages {
    stage('error') {
      steps {
        parallel(
          "test1": {
            echo 'sevlam'
            
          },
          "test2": {
            echo 'parallel2'
            
          },
          "test3": {
            build(job: 'test', propagate: true)
            
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