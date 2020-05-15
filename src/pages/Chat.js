import React, { Component } from "react";
import Header from "../components/Header";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth().currentUser,
            chats: [],
            listchats:[],
            content: '',
            cname:'',
            readError: null,
            writeError: null,
            loadingChats: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.myRef = React.createRef();
    }


    async componentDidMount() {
        this.setState({ readError: null, loadingChats: true });
        const chatArea = this.myRef.current;
        try {
            db.ref('channels').on("value",snapshot=>{
                let listchats=[];
                snapshot.forEach((snap) => {
                    listchats.push(snap.val());
                    // console.log(snap.val());
                });

                this.setState({listchats});
            });
            db.ref('channels/1/name').on("value",snapshot=>{
                let cname="";
                // console.log(snapshot.val());
                cname=snapshot.val();
                this.setState({cname});
            });
            db.ref("channels/1/chats").on("value", snapshot => {
                let chats = [];
                
                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });
                chats.sort(function (a, b) { return a.timestamp - b.timestamp })
                this.setState({ chats });
                chatArea.scrollBy(0, chatArea.scrollHeight);
                this.setState({ loadingChats: false });
            });
        } catch (error) {
            this.setState({ readError: error.message, loadingChats: false });
        }
    }

    handleChange(event) {
        this.setState({
            content: event.target.value
        });
    }
    async createChannel(event){
        var txt;
        var person = prompt("Please enter channel name:", "Channel name");
        if (person === null || person === "") {
          txt = "User cancelled the prompt.";
        } else {
          txt = "Channel " + person + " created.";
        }
        try{
            await db.ref("channels/3/name").push({
                name:txt
            });
          txt = "Channel " + person + " created.";
            console.log(txt);
        }
        catch(error){
            txt= "ERROR";
        console.log(txt);
        }

    }
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ writeError: null });
        const chatArea = this.myRef.current;
        try {
            await db.ref("channels/{id}/chats").push({
                content: this.state.content,
                timestamp: Date.now(),
                uid: this.state.user.uid,
                name: this.state.user.displayName
            });
            this.setState({ content: '' });
            chatArea.scrollBy(0, chatArea.scrollHeight);
        } catch (error) {
            this.setState({ writeError: error.message });
        }
    }

    formatTime(timestamp) {
        const d = new Date(timestamp);
        const time = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
        return time;
    }

    render() {
        return (
            <div>
                <Header />
                <div className="leftside">
                    
                    <div className="chat-list">
                        
                    <div className="create-channel">

                    <button onClick={this.createChannel}>+ Create Direct</button>
                    <t></t>
                        <button>+ Create Channel</button>
                    </div>
                    {this.state.listchats.map(lchat => {
                      return(
                          <div className="channelnames">
                              <li>{lchat.name}</li>
                         </div>
                      );
                    })}

                    </div>
                </div>

                    <div className="rightside">
                        <div className="chat-area" ref={this.myRef}>
                            
                            {/* loading indicator */}
                            {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : ""}
                            <div className="channelinfo">
                                {this.state.cname}
                            </div>
                            <hr />
                            {/* chat area */}
                            {this.state.chats.map(chat => {
                                return (
                                    <div>
                                        <p key={chat.timestamp} className={"chat-bubble " + (this.state.user.uid === chat.uid ? "current-user" : "nc-user")}>
                                            <div className='sender float-right'>~{chat.name}</div><br></br>
                                            {chat.content}
                                            <br /><br />
                                            <span className="chat-time float-right">{this.formatTime(chat.timestamp)}</span><br></br>
                                        </p>
                                    </div>

                                );
                            })}
                        </div>
                        <form onSubmit={this.handleSubmit} className="mx-3">

                            <input name="content" type="text" id="usermsg" className="form-control" onChange={this.handleChange} value={this.state.content} />
                            {/* <textarea className="" name="content" onChange={this.handleChange} value={this.state.content}></textarea> */}
                            <button type="submit" className="btn btn-submit sendbtn">Send</button>
                            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}

                        </form>
                        <div className="py-5 mx-3">
                            Login in as: <strong className="text-info">{this.state.user.email}</strong>
                        </div>
                    </div>
                
            </div>
        );
    }
}







