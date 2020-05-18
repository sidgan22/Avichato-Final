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
            listchats: [],
            listofc: [],
            content: '',
            cname: '',
            readError: null,
            cchannelid: "",
            writeError: null,
            loadingChats: false,
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.myRef = React.createRef();

    }


    async componentDidMount() {
        this.setState({ readError: null });
        this.createChats();

         this.renderChatss();
    }
    
    async createChats() {
        var uidadmin = auth().currentUser.uid;
        var str = "";
        this.setState({ loadingChats: true });
        try {
            db.ref('users/' + uidadmin + "/cid").on("value", snapshot => {
                str += snapshot.val();
                console.log("Str is : " + str);
                this.state.listofc.splice(0,this.state.listofc.length);
                this.state.listofc.push(str.split(" "));
                // listofcs=str;
                console.log(this.state.listofc);
            });
            // this.setState({ listofc });

        }
        catch (error) {
            console.log(error);
        }
        try {

            await db.ref('channels').on("value", snapshot => {

                let listchatss = [];
                let cch = "";
                let x = "";
                snapshot.forEach((snap) => {


                    x = snap.key;
                    console.log("Chn List " + this.state.listofc);
                    var listdummy = this.state.listofc;
                    console.log("Key is" + x);
                    console.log("Dummy " + listdummy);
                    if (listdummy.length !== 0) {
                        if (listdummy[0].indexOf(x) !== -1) {

                            console.log("Includes");
                            listchatss.push(snap.val());
                            cch = x;

                            console.log(listchatss);
                        }
                    }

                    // console.log(snap.val());
                });


                this.setState({ listchats: listchatss, cchannelid: cch });
            });

            this.setState({ loadingChats: false });
            this.renderChatss();

        } catch (error) {
            this.setState({ readError: error.message, loadingChats: false });
        }
        this.renderChatss();

    }

    async renderChatss() {

        const chatArea = this.myRef.current;

        var cchannelid = this.state.cchannelid == null ? "1" : this.state.cchannelid.toString();
        try {
            this.setState({ loadingChats: true });
            db.ref('channels/' + cchannelid + '/name').on("value", snapshot => {
                let cname = "";
                // console.log(snapshot.val());
                cname = snapshot.val();
                this.setState({ cname: cname });
            });
            db.ref("channels/" + cchannelid + "/chats").on("value", snapshot => {
                let chats = [];

                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });
                chats.sort(function (a, b) { return a.timestamp - b.timestamp })
                this.setState({ chats });
                chatArea.scrollBy(0, chatArea.scrollHeight);
                this.setState({ loadingChats: false });
            });
        }
        catch (error) {

        }


    }

    handleChange(event) {
        this.setState({
            content: event.target.value
        });

        // this.renderChatss();
    }
    async joinChannel(event) {
        var channelname = prompt("Enter channel ID:", "");
        if (channelname === null || channelname === "") {
            console.log("Prompt cancelled");
        } else {

            try {
                var kid = channelname;

                var uidadmin = auth().currentUser.uid;
                const uRef = db.ref().child('users/' + uidadmin + "/cid");
                uRef.on("value", function (snapshot) {
                    console.log("snap:" + snapshot.val());
                });
                console.log("User id is " + uidadmin);
                uRef.transaction(function (current_value) {
                    if (!current_value.includes(kid)) {

                        console.log("User added to " + kid);

                        return (current_value || "") + " " + kid;

                    }
                    else {
                        console.log("User already in " + kid);
                        return (current_value);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
            window.location.reload();
        }

    }
    async createChannel(event) {
        var txt;
        var channelname = prompt("Please enter channel name:", "Channel name");
        var channelmem = prompt("Add members: ", "sid")
        if (channelname === null || channelname === "" || channelmem === null || channelmem === "") {
            txt = "User cancelled the prompt.";


        } else {
            try {
                var uidadmin = auth().currentUser.uid;
                const ref = db.ref().child("channels");
                var data = {
                    name: channelname,
                    channelID: "",
                    admin: uidadmin
                };
                var keyid = ref.push(data);
                var kid = (await keyid).key;
                
                const uKey = db.ref().child('users/' + uidadmin + "/").key;
                console.log("Key is:" + uKey);
                const uRef = db.ref().child('users/' + uidadmin + "/cid");
                uRef.on("value", function (snapshot) {
                    console.log("snap:" + snapshot.val());
                });
                console.log("User id is " + uidadmin);
                uRef.transaction(function (current_value) {
                    return (current_value || "") + " " + kid;
                });
                //uRef.update(datas);
                const usRef = db.ref().child('users/' + channelmem + "/cid");
                uRef.on("value", function (snapshot) {
                    console.log("snap:" + snapshot.val());
                });
                console.log("User id is " + channelmem);
                usRef.transaction(function (current_value) {
                    return (current_value || "") + " " + kid;
                });
                db.ref().child("channels/" + kid).set(
                    {
                        channelID: kid,
                        name: channelname,
                        admin: uidadmin
                    }
                );
                txt = "Channel " + channelname + " created.";
                console.log(txt);
            }
            catch (error) {
                txt = error;
                console.log(txt);
            }

            try {
                this.checkChats();
                console.log("mountd comp ");
            }
            catch (error) {
                console.log("Update error is: " + error);
            }
        }


    }
    
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ writeError: null });
        var cchannelid = this.state.cchannelid == null ? "1" : this.state.cchannelid.toString();
        const chatArea = this.myRef.current;
        if(this.state.content!=null)
        try {
            await db.ref("channels/" + cchannelid + "/chats").push({
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
    addmem(){
        var xx = prompt("Enter channel ID","ID");
        var channelmem=prompt("Enter user id to add: " , "");
        // var kid = this.cchannelid;
        console.log(channelmem);

        console.log("ccod: "+this.state.cchannelid);
        const reff=db.ref().child('users/');
        reff.on("value",function(snapshot){
            snapshot.forEach((snap)=>{
                if(snap.val()===channelmem)
                {
                    const usRef = db.ref().child('users/' + channelmem + "/cid");
                usRef.on("value", function (snapshot) {
                    console.log("snap:" + snapshot.val());
                });
                console.log("User id is " + channelmem);
                usRef.transaction(function (current_value) {
                    return (current_value || "") + " " + xx;
                });
                }

            });
        });
        
    }

    formatTime(timestamp) {
        const d = new Date(timestamp);
        const time = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
        return time;
    }

    render() {
        return (



            <div className="notscroll">
                <Header />
                <div className="leftside">

                    <div className="chat-list">

                        <div className="create-channel">

                            <button className="btn btn-success mr-4" onClick={this.createChannel}>+ Create Channel"</button>

                            <button className="btn btn-warning" onClick={this.joinChannel}>+ Join channel</button>
                        </div>
                        <hr></hr>
                        {this.createChats}
                        {this.state.listchats.map(lchat => {
                            return (
                                <div className="channelnames">
                                    {/* <li ></li> */}
                                    {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div> : <button key={lchat.channelID} className="btn btn-primary btn-lg btn-block" onClick={() => {
                                        // this.state.cchannelid=lchat.channelID;
                                        this.setState({ cchannelid: lchat.channelID });
                                        this.renderChatss();
                                    }}>{lchat.name}</button>}
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
                            <button className="btn-secondary btn" onClick={() => {
                                var disp =this.state.cchannelid;
                                alert("Channel ID: "+disp);
                            }}>

                                {this.state.cname}
                            </button>
                            
                        <button className="btn btn-link" onClick={this.addmem}>+ Add members</button>
                        </div>
                        <br></br>
                        <hr></hr>
                        {/* chat area */}
                        {this.state.chats.map(chat => {
                            return (
                                <div>
                                    <p key={chat.timestamp} className={"chat-bubble " + (this.state.user.uid === chat.uid ? "current-user" : "nc-user")}>
                                        <div className='sender float-right'>~{chat.name}</div><br></br>
                                        {chat.content}
                                        <br/><br />
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
                        {/* <input type="file" onChange={} />
                        <button onClick={}>Upload File</button> */}
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









// import React, { Component } from "react";
// import Header from "../components/Header";
// import { auth } from "../services/firebase";
// import { db } from "../services/firebase";

// class Chat extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             user: auth().currentUser,
//             chats: [],
//             listchats: [],
//             listofc: [],
//             content: '',
//             cname: '',
//             readError: null,
//             cchannelid: "1",
//             writeError: null,
//             loadingChats: false,
//             loading: false
//         };
//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//         this.createChats = this.createChats.bind(this);
//         this.myRef = React.createRef();

//     }
//     async componentDidMount() {
//         this.setState({ readError: null });
//         console.log("comp Did mount");
//         this.createChats();
//         this.renderChatss();
//     }

//     async createChats() {
//         console.log("Create called");
//         var uidadmin = auth().currentUser.uid;
//         var str = "";
//         this.setState({ loadingChats: true });
//         try {
//             // let listofcs = [];
//             // db.ref('users/' + uidadmin + "/cid").on("value", snapshot => {
//             //     str += snapshot.val();
//             //     console.log("Str is : " + str);
//             //     listofcs.push(str.split(" "));
//             //     // listofcs=str;
//             //     console.log(listofcs);
//             //     this.setState({ listofc: listofcs });
//             // });
//             // let listofc = [];
//             db.ref('users/' + uidadmin + "/cid").on("value", snapshot => {
//                 str += snapshot.val();
//                 console.log("Str is : " + str);
//             this.state.listofc.splice(0,this.state.listofc.length);
//                 this.state.listofc.push(str.split(" "));
//                 // listofcs=str;
//                 console.log(this.state.listofc);
//             });
            
//             // this.setState({ listofc });
//             console.log("list of chat "+this.state.listofc);
//         }
//         catch (error) {
//             console.log(error);
//         }
//         this.setState({ loadingChats: false });
        
//         this.renderChatsss();
       
//     }
//     async renderChatss() {

//         const chatArea = this.myRef.current;

//         var cchannelid = this.state.cchannelid == null ? "1" : this.state.cchannelid.toString();
//         try {
//             this.setState({ loadingChats: true });
//             db.ref('channels/' + cchannelid + '/name').on("value", snapshot => {
//                 let cname = "";
//                 // console.log(snapshot.val());
//                 cname = snapshot.val();
//                 this.setState({ cname: cname });
//             });
//             db.ref("channels/" + cchannelid + "/chats").on("value", snapshot => {
//                 let chats = [];

//                 snapshot.forEach((snap) => {
//                     chats.push(snap.val());
//                 });
//                 chats.sort(function (a, b) { return a.timestamp - b.timestamp })
//                 this.setState({ chats });
//                 chatArea.scrollBy(0, chatArea.scrollHeight);
//                 this.setState({ loadingChats: false });
//             });
//         }
//         catch (error) {

//         }


//     }

//     async renderChatsss() {
        
//         try {

//             await db.ref('channels').on("value", snapshot => {

//                 let listchatss = [];
//                 let cch = "";
//                 let x = "";
//                 snapshot.forEach((snap) => {

                    
//                     x = snap.key;
//                     console.log("Chn List " + this.state.listofc);
//                     var listdummy = this.state.listofc;
//                     console.log("Key is" + x);
//                     console.log("Dummy " + listdummy);
//                     if (listdummy.length !== 0) {
//                         if (listdummy[0].indexOf(x) !== -1) {

//                             console.log("Includes");
//                             listchatss.push(snap.val());
//                             cch = x;

//                             console.log(listchatss);
//                         }
//                     }

//                     // console.log(snap.val());
//                 });


//                 this.setState({ listchats: listchatss, cchannelid: cch });
//             });
//             this.renderChatss();

//         } catch (error) {
//             this.setState({ readError: error.message, loadingChats: false });
//         }
//     }

//     handleChange(event) {
//         this.setState({
//             content: event.target.value
//         });
//         this.state.renderChatss();
//     }
//     async joinChannel(event) {
//         var channelname = prompt("Enter channel ID:", "");
//         if (channelname === null || channelname === "") {
//             console.log("Prompt cancelled");
//         } else {

//             try {
//                 var kid = channelname;

//                 var uidadmin = auth().currentUser.uid;
//                 const uRef = db.ref().child('users/' + uidadmin + "/cid");
//                 uRef.on("value", function (snapshot) {
//                     console.log("snap:" + snapshot.val());
//                 });
//                 console.log("User id is " + uidadmin);
//                 uRef.transaction(function (current_value) {
//                     if (!current_value.includes(kid)) {

//                         console.log("User added to " + kid);

//                         return (current_value || "") + " " + kid;

//                     }
//                     else {
//                         console.log("User already in " + kid);
//                         return (current_value);
//                     }
//                 });
//             }
//             catch (error) {
//                 console.log(error);
//             }
//             window.location.reload();
//         }

//     }
//     async createChannel(event) {
//         var txt;
//         var channelname = prompt("Please enter channel name:", "Channel name");
//         var channelmem = prompt("Add members: ", "sid")
//         if (channelname === null || channelname === "" || channelmem === null || channelmem === "") {
//             txt = "User cancelled the prompt.";


//         } else {
//             try {
//                 var uidadmin = auth().currentUser.uid;
//                 const ref = db.ref().child("channels");
//                 var data = {
//                     name: channelname,
//                     channelID: "",
//                     admin: uidadmin
//                 };
//                 var keyid = ref.push(data);
//                 var kid = (await keyid).key;
//                 const uKey = db.ref().child('users/' + uidadmin + "/").key;
//                 console.log("Key is:" + uKey);
//                 const uRef = db.ref().child('users/' + uidadmin + "/cid");
//                 uRef.on("value", function (snapshot) {
//                     console.log("snap:" + snapshot.val());
//                 });
//                 console.log("User id is " + uidadmin);
//                 uRef.transaction(function (current_value) {
//                     return (current_value || "") + " " + kid;
//                 });
//                 //uRef.update(datas);

//                 db.ref().child("channels/" + kid).set(
//                     {
//                         channelID: kid,
//                         name: channelname,
//                         admin: uidadmin
//                     }
//                 );
//                 txt = "Channel " + channelname + " created.";
//                 console.log(txt);
//                 window.location.reload();
//             }
//             catch (error) {
//                 txt = error;
//                 console.log(txt);
//             }

//         }


//     }
//     async handleSubmit(event) {
//         event.preventDefault();
//         this.setState({ writeError: null });
//         var cchannelid = this.state.cchannelid == null ? "1" : this.state.cchannelid.toString();
//         const chatArea = this.myRef.current;
//         try {
//             await db.ref("channels/" + cchannelid + "/chats").push({
//                 content: this.state.content,
//                 timestamp: Date.now(),
//                 uid: this.state.user.uid,
//                 name: this.state.user.displayName
//             });
//             this.setState({ content: '' });
//             chatArea.scrollBy(0, chatArea.scrollHeight);
//         } catch (error) {
//             this.setState({ writeError: error.message });
//         }
//     }

//     formatTime(timestamp) {
//         const d = new Date(timestamp);
//         const time = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
//         return time;
//     }

//     render() {
//         return (
//             <div className="notscroll">
//                 <Header />
//                 <div className="leftside" listofc={this.createChats}>

//                     <div className="chat-list">

//                         <div className="create-channel">

//                             <button onClick={this.createChannel}>+ Create Channel"</button>

//                             <button onClick={this.joinChannel}>+ Join channel</button>
//                         </div>
//                         {this.state.listchats.map(lchat => {
//                             return (
//                                 <div className="channelnames">
//                                     {/* <li ></li> */}
//                                      <button key={lchat.channelID} className="btn btn-dark" onClick={() => {
                                        
//                                         this.setState({ cchannelid: lchat.channelID });
                                    
//                                         }}>{lchat.name}</button>

//                                 </div>
//                             );
//                         })}

//                     </div>
//                 </div>

//                 <div className="rightside">
//                     <div className="chat-area" ref={this.myRef}>

//                         {/* loading indicator */}
//                         {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
//                             <span className="sr-only">Loading...</span>
//                         </div> : <div className="channelinfo">
//                             <button className="btn-light" onClick={() => {
//                                 var disp =this.state.cchannelid;
//                                 alert("Channel ID: "+disp);
//                             }}>
//                                 Cname
//                                 {/* {this.state.cname} */}
//                             </button>
//                         </div>}
                        
//                         <hr />
//                         {/* chat area */}
//                         {this.state.chats.map(chat => {
//                             console.log("Cahat: "+chat);
//                             return (
//                                 <div>
//                                     <p key={chat.timestamp} className={"chat-bubble " + (this.state.user.uid === chat.uid ? "current-user" : "nc-user")}>
//                                         <div className='sender float-right'>~{chat.name}</div><br></br>
//                                         {chat.content}
//                                         <br /><br />
//                                         <span className="chat-time float-right">{this.formatTime(chat.timestamp)}</span><br></br>
//                                     </p>
//                                 </div>

//                             );
//                         })}
//                     </div>
//                     <form onSubmit={this.handleSubmit} className="mx-3">

//                         <input name="content" type="text" id="usermsg" className="form-control" onChange={this.handleChange} value={this.state.content} />
//                         {/* <textarea className="" name="content" onChange={this.handleChange} value={this.state.content}></textarea> */}
//                         <button type="submit" className="btn btn-submit sendbtn">Send</button>
//                         {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}

//                     </form>
//                     <div className="py-5 mx-3">
//                         Login in as: <strong className="text-info">{this.state.user.email}</strong>
//                     </div>
//                 </div>

//             </div>
//         );
//     }
// }
// export default Chat;







