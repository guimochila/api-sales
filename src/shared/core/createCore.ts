function createCore() {
  function start() {
    console.log('> [core] Starting...')

    console.log('> [core] Starting Done! System is running! 🚀')
  }

  function stop() {
    console.log('> [core] Stopping...')

    console.log('> [core] Stopping done!')
  }

  return {
    start,
    stop,
  }
}

export default createCore
