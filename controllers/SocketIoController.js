class SocketIoController {
  constructor() {
    this._bindMethods(['getSocketIo']);
  }

  //************Get getSocketIo**********//
  getSocketIo(request, response, next) {
    let message = 'I am connected to the backend, socketIo';
    return message;
    //console.log(message)
  }

  //****Binding Methods****//
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = SocketIoController;
