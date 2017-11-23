import React, { Component } from 'react'

class ChatRoom extends Component {
  state = {
    users: [],
    messages: [],
    currentMessage: "",
    socket: null
  }

  componentWillMount() {

    if(!this.props.username || !this.props.room)
      return this.props.history.replace('/')

    const socket = new WebSocket("ws://188.166.221.63:8000")
    socket.onmessage = this.messageHandler
    socket.onopen = () => {
      this.setState({socket})
      socket.send(JSON.stringify({
        type: 'join',
        data: {
          username: this.props.username,
          room: this.props.room
        }
      }))
    }
  }

  messageHandler = (socketData) => {
    
    const data = JSON.parse(socketData.data)
    console.log(data)
    switch(data.type) {
      case "join_success": 
        break;
      case "history": 
        this.setState({messages: data.data.messages})
        break;
      case "members":
        this.setState({ users: data.data })
        break;
      case "message":
        this.setState({messages: this.state.messages.concat([data.data])})
      case "joined":
        this.setState({users: [...this.state.users, data.data.name]})
        this.setState({messages: [...this.state.messages, {message: `${data.data.name} has entered the room`, author: ''}]})
        break;
    }
  }

  sendMessage = () => {
    this.state.socket.send(JSON.stringify(
     { type: 'message',
      data: {message: this.state.currentMessage}}
    ))
  }

  logOut = () => {
    this.props.history.push("/")
  }

  render() {
    return (
      <div>
        <header className="App-Header2">
          <img src="https://image.ibb.co/gvqtiR/logo.png" alt="logo" />
          <h1 className="App-title">ChitChat</h1>
          <button onClick={this.logOut}>Leave Room</button>
        </header>

        <div className="users">
          {
            this.state.users.map(user => (
              <p>{user}</p>
            ))
          }
        </div>

        <div className="chatbox">
          <div className="chatlogs">
            {
              this.state.messages.map(message => (
                <div className="chat">
                  {/* <img className="user-photo" src="https://image.ibb.co/nQpP8R/cat1.jpg" /> */}
                  <p className="chat-message">{message.message}</p>
                  <p className="user1">{message.author}</p>
                </div>
              ))
            }
          </div>
        </div>

        <div className="typebox">
          <textarea onChange={(ev) => this.setState({currentMessage: ev.target.value})}></textarea>
          <button onClick={this.sendMessage} >Send</button>
        </div>
      </div>

    )
  }
}

export default ChatRoom;