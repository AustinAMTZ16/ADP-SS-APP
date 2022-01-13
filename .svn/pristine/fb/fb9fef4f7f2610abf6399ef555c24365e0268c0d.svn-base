import React, { Component } from 'react';
import queueFactory from 'react-native-queue';
import { connect } from 'react-redux';

class QueueJobFactory extends Component {

  constructor( props ) {
    super(props);

    this.state = {
      queue: null
    };

    this.init();

  }

  async init() {

    const queue = await queueFactory();

    this.standardJob(queue);

    this.recursiveJob(queue);

    this.chainJob(queue);

    // Start queue to process any jobs that hadn't finished when app was last closed.
    queue.start();

    this.setState({
      queue
    });

  }

  componentWillReceiveProps( nextProps ) {
    if( this.props.appSyncData !== nextProps.appSyncData ) {
      this.state.queue.createJob('recursive', {});
    }
  }

  /**
   *
   * @param queue
   */
  standardJob( queue ) {
    //
    // Standard Job Example
    // Nothing fancy about this job.
    //
    queue.addWorker('standard', async ( id, payload ) => {
      //console.log('standard-example job ' + id + ' executed.');
    });
  }

  /**
   *
   * @param queue
   */
  recursiveJob( queue ) {
    //
    // Recursive Job Example
    // This job creates itself over and over.
    //
    let recursionCounter = 1;
    queue.addWorker('recursive', async ( id, payload ) => {
      //console.log('recursive job ' + id + ' started');
      //console.log(recursionCounter, 'recursionCounter');

      recursionCounter++;

      await new Promise(( resolve ) => {
        setTimeout(() => {
          //console.log('recursive ' + id + ' has completed!');

          // Keep creating these jobs until counter reaches 3.
          if( recursionCounter <= 3 ) {
            queue.createJob('recursive');
          }

          resolve();
        }, 1000);
      });

    });

  }

  /**
   *
   * @param queue
   */
  chainJob( queue ) {
    //
    // Job Chaining Example
    // When job completes, it creates a new job to handle the next step
    // of your process. Breaking large jobs up into smaller jobs and then
    // chaining them together will allow you to handle large tasks in
    // OS background tasks, that are limited to 30 seconds of
    // execution every 15 minutes on iOS and Android.
    //
    queue.addWorker('start-job-chain', async ( id, payload ) => {
      //console.log('start-job-chain job ' + id + ' started');
      //console.log('step: ' + payload.step);

      await new Promise(( resolve ) => {
        setTimeout(() => {
          //console.log('start-job-chain ' + id + ' has completed!');

          // Create job for next step in chain
          queue.createJob('job-chain-2nd-step', {
            callerJobName: 'start-job-chain',
            step: payload.step + 1
          });

          resolve();
        }, 1000);
      });

    });

    queue.addWorker('job-chain-2nd-step', async ( id, payload ) => {
      //console.log('job-chain-2nd-step job ' + id + ' started');
      //console.log('step: ' + payload.step);

      await new Promise(( resolve ) => {
        setTimeout(() => {
          //console.log('job-chain-2nd-step ' + id + ' has completed!');

          // Create job for last step in chain
          queue.createJob('job-chain-final-step', {
            callerJobName: 'job-chain-2nd-step',
            step: payload.step + 1
          });

          resolve();
        }, 1000);
      });

    });

    queue.addWorker('job-chain-final-step', async ( id, payload ) => {
      //console.log('job-chain-final-step job ' + id + ' started');
      //console.log('step: ' + payload.step);

      await new Promise(( resolve ) => {
        setTimeout(() => {
          //console.log('job-chain-final-step ' + id + ' has completed!');
          //console.log('Job chain is now completed!');

          resolve();
        }, 1000);
      });

    });

  }

  makeJob( jobName, payload = {} ) {
    this.state.queue.createJob(jobName, payload);
  }

  render() {
    return null;
  }
}


Component.propTypes = {};

function bindAction( dispatch ) {
  return {};
}

const mapStateToProps = state => ({
  appSyncData: state.syncDataReducer.appSyncData,
});

export default connect(mapStateToProps, bindAction)(QueueJobFactory);
